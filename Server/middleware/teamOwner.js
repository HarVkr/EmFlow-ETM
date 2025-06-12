const jwt = require('jsonwebtoken');
require('dotenv').config();
const teams = require('../models/Team');
const employees = require('../models/User');

/**
 * Middleware to verify that the authenticated user is the manager of the specified team
 * Can be used on routes that require team ownership verification
 */
const teamOwnerAuth = async (req, res, next) => {
    try {
        // First verify the user is authenticated
        const authHeader = req.header('Authorization');
        if (!authHeader) return res.status(401).json({ msg: "Authentication required." });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ msg: "Invalid authentication token." });

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) return res.status(401).json({ msg: "Invalid or expired token." });

        // Get user ID from token
        const userId = decoded.id;
        
        // Find user in database
        const user = await employees.findById(userId);
        if (!user) return res.status(404).json({ msg: "User not found." });
        
        // Attach user to request object for later use
        req.employee = {
            id: user._id,
            role: user.role
        };

        // Get teamID from request params or body
        let teamID = req.params.teamID || req.body.teamID;
        
        // If there's no teamID in the params or body, continue (may be handled by the controller)
        if (!teamID) {
            console.warn('No teamID provided in request params or body');
            return next();
        }

        // Find the team
        const team = await teams.findById(teamID);
        if (!team) return res.status(404).json({ msg: "Team not found." });
        
        // Check if user is the team manager
        if (team.managerID.toString() !== userId.toString()) {
            return res.status(403).json({ 
                msg: "Access denied. You are not the manager of this team." 
            });
        }

        // If we got here, the user is the team manager, so proceed
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: "Invalid token." });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token expired." });
        }
        return res.status(500).json({ msg: err.message });
    }
};

module.exports = teamOwnerAuth;