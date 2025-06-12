const jwt = require('jsonwebtoken');

require('dotenv').config();

const auth = (req, res, next) => {
    try{
        const authHeader = req.header('Authorization');
        if(!authHeader) return res.status(400).json({msg: "Invalid Authentication 1."});

        const token = authHeader.split(' ')[1]
        if (!token) return res.status(400).json({ msg: "Invalid Authentication 2." });
        
        console.log("Recieved Token: ", token);
        console.log("Using Secret: ", process.env.ACCESS_TOKEN_SECRET);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err){
                console.log("Token Verification Error: ", err);
                return res.status(400).json({msg: "Invalid Authentication 2."});
            } 
            req.employee = decoded;
            req.user = decoded;
            console.log("Verified. Employee: ", decoded);
            
            next();
        })
    }
    catch(err){
        return res.status(500).json({msg: err.message});
    }
};
module.exports = auth;