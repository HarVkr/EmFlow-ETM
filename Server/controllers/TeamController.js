const teams = require('../models/Team');
const tasks = require('../models/Task');
const employees = require('../models/User');

const teamCtrl = {
    createTeam: async (req, res) => {
        try{
            const {teamName, managerID} = req.body;
            if(!teamName || !managerID) return res.status(400).json({msg: "Please fill in all fields."});
            
            const team = await teams.findOne({teamName});
            if(team) return res.status(400).json({msg: "This team already exists."});
            
            const newTeam = new teams({
                teamName, managerID, members: []
            });
            await newTeam.save();
            res.json({msg: "Team Created Successfully."});
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    addMemberstoTeam: async (req, res) => {
        try{
            const {teamID, memberIDs} = req.body;

            if(!teamID || !memberIDs) return res.status(400).json({msg: "Please fill in all fields."});

            const team = await teams.findByIdAndUpdate(teamID, {$addToSet: {members: {$each: memberIDs}}}, {new: true});

            await employees.updateMany({_id: {$in: memberIDs}}, {$set: {teamID: team._id}});
            res.json({msg: "Members added to the team successfully."});
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getTeamDetails: async (req, res) => {
        try{
            const teamID = req.params.teamID;
            const teamDetails = await teams.findById(teamID).populate('members');;
            res.json(teamDetails);
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getTeamTasks: async (req, res) => {
        try{
            const teamID = req.params.teamID;
            const teamTasks = await tasks.find({teamID}).populate('employeeIDs');
            res.json(teamTasks);
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    }
};
module.exports = teamCtrl;