const jwt = require('jsonwebtoken');
require('dotenv').config();
const employees = require('../models/User');

const authAdmin = async (req, res, next) => {
    try{
        const adminExists = await employees.findOne({ role: 'Admin' });
        if(!adminExists){
            return next();
        }
        const authHeader = req.header('Authorization');
        if(!authHeader) return res.status(400).json({msg: "Invalid Authentication (Admin)."});

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(400).json({ msg: "Invalid Authentication (Admin)." });

        console.log("Token: ", token);

        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified;
        
        console.log("Verified. User: ", req.user);
        
        if (!req.user.role) {
            return res.status(400).json({ msg: "Role not found in token." });
        }
        
        if(req.user.role !== 'Admin'){
            return res.status(400).json({msg: "Admin resources access denied."});
        }
        next();
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
}

module.exports = authAdmin;