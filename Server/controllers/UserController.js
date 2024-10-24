const employees = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tasks = require('../models/Task');
const argon2 = require('argon2');

const userCtrl = {
    refreshtoken : async (req, res) => {
        // try{
        //     const rf_token = req.cookies.refreshtoken;
        //     console.log("Received refresh token:", rf_token);
        //     if(!rf_token) return res.status(400).json({msg: "Please Login UP"});

        //     const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        //     if (!refreshTokenSecret) return res.status(500).json({msg: "Refresh token secret is not defined."});

        //     jwt.verify(rf_token, refreshTokenSecret, (err, employee) => {
        //         if(err) return res.status(400).json({msg: "Please Login down"});
        //         const accessToken = createAccessToken({id: employee.id});
        //         res.json({accessToken});
        //     });
        // }catch(err){
        //     return res.status(500).json({msg: err.message});
        // }
        try {
            const rf_token = req.cookies.refreshtoken;
            
            if(!rf_token) {
                return res.status(401).json({msg: "Please login to continue"});
            }
    
            const decoded = jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET);
            if(!decoded) {
                return res.status(401).json({msg: "Invalid or expired refresh token. Please login again."});
            }
    
            const user = await employees.findById(decoded.id);
            if(!user) {
                return res.status(401).json({msg: "User not found"});
            }
    
            const accessToken = createAccessToken({id: user._id, role: user.role});
            res.json({accessToken});
        } catch(err) {
            return res.status(401).json({msg: "Please login to continue"});
        }
    },
    login: async (req, res) => {
        try{
            const {userID, password} = req.body;
            console.log(req.body);
            const user = await employees.findOne({userID});
            console.log(user);
            
            if(!user) return res.status(400).json({msg: "User does not exist."});
            console.log("Stored Hashed Password: ", user.password);
            console.log("Provided Password: ", password);
            
            //const isMatch = await bcrypt.compare(password, user.password);
            const isMatch = await comparePassword(password, user.password);
            console.log("Password Match: ", isMatch);
            

            if(!isMatch) return res.status(400).json({msg: "Incorrect password."});

            const accessToken = createAccessToken({id: user._id, role: user.role});
            const refreshToken = createRefreshToken({id: user._id, role: user.role});

            res.cookie('refreshtoken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                path: '/employee/refresh_token',
                secure: process.env.NODE_ENV === 'production'
            });
            res.json({accessToken});
        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    createEmployee: async (req, res) =>{
        try{
            const {userID, password, role, teamID} = req.body;
            if(!userID || !password || !role) return res.status(400).json({msg: "Please fill in all fields."});

            const adminExists = await employees.findOne({ role: 'Admin' });

            if(!adminExists && role !== 'Admin') return res.status(400).json({msg: "First Admin must be created."});

            if(role === 'Admin' && adminExists) return res.status(400).json({msg: "Admin already exists."});

            //const hashedPassword = await bcrypt.hash(password, 10);
            const hashedPassword = await hashPassword(password);
            const employee = new employees({
                userID, password: hashedPassword, role, teamID: teamID || null
            });
            await employee.save();
            
            res.json({msg: "Employee Created Successfully."});
        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    deleteEmployee: async (req, res) => {
        try{
            await employees.findByIdAndDelete(req.params.id);
            res.json({msg: "Deleted Successfully."});
        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    logout: async (req, res) => {
        try{
            res.clearCookie('refreshtoken', {path: '/employee/refresh_token'});
            return res.json({msg: "Logged Out."});
        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getUser: async (req, res) => {
        try{
            const employee = await employees.findById(req.employee.id).select('-password');
            if(!employee) return res.status(400).json({msg: "Employee not found."});
            res.json(employee);
        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getTasks: async (req, res) => {
        try{
            const employee = await employees.findById(req.employee.id);
            if(!employee) return res.status(400).json({msg: "Employee not found."});

            console.log("Employee: ", employee);
            
            const taskDetails = await tasks.find({ '_id': { $in: employee.tasks } });
            res.json(taskDetails);

        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    editRole: async(req, res) => {
        try{
            const {role} = req.body;
            await employees.findOneAndUpdate({_id: req.params.id}, {
                role
            });
            res.json({msg: "Role Updated Successfully."});
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getEmployeeDatabyID: async (req, res) => {
        try{
            const employee = await employees.findById(req.params.id).select('-password');
            if(!employee) return res.status(400).json({msg: "Employee not found."});
            res.json(employee);
        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getEmployeeIDsbyName: async (req, res) => {
        try{
            const {userID} = req.body;
            const employeeID = await employees.findOne({userID: userID}).select('_id');
            if(!employeeID) return res.status(400).json({msg: "Employee not found."});
            res.json(employeeID); 

        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getEmployeeNamebyID: async (req, res) => {
        try{
            const {id} = req.body;
            const employeeName = await employees.findById(id).select('userID');
            if(!employeeName) return res.status(400).json({msg: "Employee not found."});
            res.json(employeeName);
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    }
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

const hashPassword = async (password) => {
    return await argon2.hash(password);
}

const comparePassword = async (password, hashedPassword) => {
    return await argon2.verify(hashedPassword, password);
}

module.exports = userCtrl;