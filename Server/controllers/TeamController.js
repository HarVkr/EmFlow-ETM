const mongoose = require('mongoose');
const teams = require('../models/Team');
const tasks = require('../models/Task');
const employees = require('../models/User');

const teamCtrl = {
    createTeam: async (req, res) => {
        try {
            const { teamName } = req.body;
            const managerID = req.user._id; // Get manager ID from authenticated token
            
            if (!teamName) return res.status(400).json({ msg: "Please provide a team name." });
            
            // Check if team name already exists
            const team = await teams.findOne({ teamName });
            if (team) return res.status(400).json({ msg: "This team already exists." });
            
            // Verify the manager role
            const manager = await employees.findById(managerID);
            if (!manager || manager.role !== 'Team Manager') {
                return res.status(403).json({ msg: "Only team managers can create teams." });
            }
        
            // Create the team with manager as first member
            const newTeam = new teams({
                teamName,
                managerID
            });
            
            await newTeam.save();
            
            // Update manager's teamID
            await employees.findByIdAndUpdate(managerID, { teamID: newTeam._id });
            
            res.json({
                msg: "Team Created Successfully.",
                team: newTeam
            });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    addMemberstoTeam: async (req, res) => {
        try {
            const { teamID, memberIDs } = req.body;
            const managerID = req.user._id;

            if (!teamID || !memberIDs || !memberIDs.length) {
                return res.status(400).json({ msg: "Please provide team ID and member IDs." });
            }

            // Verify manager owns this team
            const team = await teams.findById(teamID);
            if (!team) return res.status(404).json({ msg: "Team not found." });
            
            console.log("Team Manager ID: ", team.managerID);
            console.log("Logged in Manager ID: ", managerID);
            
            if (team.managerID.toString() !== managerID.toString()) {
                return res.status(403).json({ msg: "You can only add members to teams you manage." });
            }
            
            // Verify all employees exist and aren't already in another team
            const employeeChecks = await employees.find({ 
                '_id': { $in: memberIDs },
                'teamID': { $ne: null } // Check if they are already in another team
            });
            console.log("Employee Checks: ", employeeChecks);
            
            if (employeeChecks.length > 0) {
                return res.status(400).json({ 
                    msg: "Some employees are already in another team.",
                    conflictingEmployees: employeeChecks.map(emp => emp.userID)
                });
            }
            // Update team with new members
            const updatedTeam = await teams.findByIdAndUpdate(
                teamID, 
                { $addToSet: { members: { $each: memberIDs } } }, 
                { new: true }
            ).populate('members', 'userID role');

            // Update employees with team ID
            await employees.updateMany(
                { _id: { $in: memberIDs } }, 
                { $set: { teamID: team._id } }
            );
            
            res.json({
                msg: "Members added to the team successfully.",
                team: updatedTeam
            });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    removeTeamMembers: async (req, res) => {
        try {
            const { teamID, memberIDs } = req.body;
            const managerID = req.user._id;
            
            if (!teamID || !memberIDs || !memberIDs.length) {
                return res.status(400).json({ msg: "Please provide team ID and member IDs." });
            }
            
            // Verify manager owns this team
            const team = await teams.findById(teamID);
            if (!team) return res.status(404).json({ msg: "Team not found." });
            
            if (team.managerID.toString() !== managerID) {
                return res.status(403).json({ msg: "You can only remove members from teams you manage." });
            }
            
            // Prevent removing the manager from their own team
            if (memberIDs.includes(managerID)) {
                return res.status(400).json({ msg: "Team manager cannot be removed from their team." });
            }
            
            // Update team by removing members
            const updatedTeam = await teams.findByIdAndUpdate(
                teamID, 
                { $pull: { members: { $in: memberIDs } } }, 
                { new: true }
            ).populate('members', 'userID role');
            
            // Remove team ID from employee records
            await employees.updateMany(
                { _id: { $in: memberIDs } }, 
                { $set: { teamID: null } }
            );
            res.json({
                msg: "Members removed from the team successfully.",
                team: updatedTeam
            });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateTeamName: async (req, res) => {
        try {
            const { teamID } = req.params;
            const { teamName } = req.body;
            const managerID = req.user._id;
            
            if (!teamName) return res.status(400).json({ msg: "Please provide a team name." });
            
            // Verify manager owns this team
            const team = await teams.findById(teamID);
            if (!team) return res.status(404).json({ msg: "Team not found." });
            
            if (team.managerID.toString() !== managerID) {
                return res.status(403).json({ msg: "You can only update teams you manage." });
            }
            
            // Check if new name already exists
            const teamWithName = await teams.findOne({ teamName, _id: { $ne: teamID } });
            if (teamWithName) return res.status(400).json({ msg: "Team name already in use." });
            
            // Update team name
            const updatedTeam = await teams.findByIdAndUpdate(
                teamID, 
                { teamName }, 
                { new: true }
            );
            
            res.json({
                msg: "Team name updated successfully.",
                team: updatedTeam
            });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getTeamDetails: async (req, res) => {
        try {
            const teamID = req.params.teamID;
            
            const teamDetails = await teams.findById(teamID)
                .populate('managerID', 'userID')
                .populate('members', 'userID role');
                
            if (!teamDetails) return res.status(404).json({ msg: "Team not found." });
            
            res.json(teamDetails);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getTeamTasks: async (req, res) => {
        try {
            const teamID = req.params.teamID;
            
            const teamTasks = await tasks.find({ teamID })
                .populate('employeeIDs', 'userID')
                .populate('managerID', 'userID');
                
            res.json(teamTasks);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    getManagerTeams: async (req, res) => {
        try {
            const managerID = req.user._id;
            
            const managerTeams = await teams.find({ managerID })
                .populate('members', 'userID role');
                
            res.json(managerTeams);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    listAllTeams: async (req, res) => {
        try {
            const allTeams = await teams.find({})
                .populate('managerID', 'userID')
                .populate('members', 'userID role');
                
            res.json(allTeams);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    getUserTeam: async (req, res) => {
        try {
            const userID = req.employee.id;
            
            const employee = await employees.findById(userID);
            if (!employee) return res.status(404).json({ msg: "Employee not found." });
            
            if (!employee.teamID) return res.json(null);
            
            const teamDetails = await teams.findById(employee.teamID)
                .populate('managerID', 'userID')
                .populate('members', 'userID role');
                
            res.json(teamDetails);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getTeamMembers: async (req, res) => {
        try {
            const teamID = req.params.teamID;
            
            const team = await teams.findById(teamID);
            if (!team) return res.status(404).json({ msg: "Team not found." });
            
            const memberDetails = await employees.find({ 
                '_id': { $in: team.members } 
            }).select('-password');
            
            res.json(memberDetails);
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // assignTaskToTeam: async (req, res) => {
    //     try {
    //         const { teamID } = req.params;
    //         const taskData = req.body;
    //         const managerID = req.user._id;
            
    //         // Verify manager owns this team
    //         const team = await teams.findById(teamID);
    //         if (!team) return res.status(404).json({ msg: "Team not found." });
            
    //         if (team.managerID.toString() !== managerID.toString()) {
    //             return res.status(403).json({ msg: "You can only assign tasks to teams you manage." });
    //         }
            
    //         // Create task with teamID
    //         const task = new tasks({
    //             ...taskData,
    //             managerID,
    //             teamID
    //         });
            
    //         await task.save();
            
    //         // Add task to team members
    //         for (const employeeID of team.members) {
    //             await employees.findByIdAndUpdate(
    //                 employeeID,
    //                 { $push: { tasks: task } }
    //             );
    //         }
            
    //         res.json({
    //             msg: "Task assigned to team successfully.",
    //             task
    //         });
    //     }
    //     catch (err) {
    //         return res.status(500).json({ msg: err.message });
    //     }
    // },
    getTeamPerformance: async (req, res) => {
        try {
            const { teamID } = req.params;
            
            // Verify team exists
            const team = await teams.findById(teamID);
            if (!team) return res.status(404).json({ msg: "Team not found." });
            
            // Get all tasks for this team
            const teamTasks = await tasks.find({ teamID });
            
            // Calculate performance metrics
            const totalTasks = teamTasks.length;
            const completedTasks = teamTasks.filter(task => task.status === 'Completed').length;
            const inProgressTasks = teamTasks.filter(task => task.status === 'In Progress').length;
            const notStartedTasks = teamTasks.filter(task => task.status === 'Not Started').length;
            
            const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0;
            
            // Get member-specific stats
            const memberStats = [];
            for (const memberID of team.members) {
                const memberTasks = teamTasks.filter(task => 
                    task.employeeIDs.some(id => id.toString() === memberID.toString())
                );
                
                const memberCompleted = memberTasks.filter(task => task.status === 'Completed').length;
                
                memberStats.push({
                    memberID,
                    totalTasks: memberTasks.length,
                    completedTasks: memberCompleted,
                    completionRate: memberTasks.length > 0 ? (memberCompleted / memberTasks.length * 100) : 0
                });
            }
            res.json({
                teamID,
                totalTasks,
                completedTasks,
                inProgressTasks,
                notStartedTasks,
                completionRate,
                memberStats
            });
        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = teamCtrl;