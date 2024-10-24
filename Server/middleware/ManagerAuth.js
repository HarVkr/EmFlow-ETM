const jwt = require('jsonwebtoken');
require('dotenv').config();
const employees = require('../models/User');

const authManager = async (req, res, next) => {
    try{
        console.log("ManagerAuth middleware executed");
        const managerExists = await employees.findOne({ role: 'Team Manager' });
        if(!managerExists){
            return next();
        }
        console.log("reached here");
        
        const authHeader = req.header('Authorization');
        if(!authHeader) return res.status(400).json({msg: "Invalid Authentication (Manager)."});

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(400).json({ msg: "Invalid Authentication (Manager)." });

        console.log("Token: ", token);

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await employees.findById(verified.id);
        if (!user) return res.status(400).json({ msg: "User not found." });
        
        req.user = user;
        
        console.log("Manager Verified. User: ", req.user);
        
        if (!req.user.role) {
            return res.status(400).json({ msg: "Role not found in token." });
        }
        
        if(req.user.role !== 'Team Manager'){
            return res.status(400).json({msg: "Manager resources access denied."});
        }
        next();
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}
module.exports = authManager;