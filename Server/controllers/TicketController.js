const tickets = require('../models/Ticket');
const ticketResposes = require('../models/TicketResponse');
const employees = require('../models/User');
const teams = require('../models/Team');
const mongoose = require('mongoose');

const ticketCtrl = {
    createTicket : async (req, res) => {
        try{
            const {
                title,
                description,
                category,
                priority,
                assignedTo,
                tags
            } = req.body;

            const createdBy = req.employee.id;

            if(!title || !description || !category){
                return res.status(400).json({msg: "Please fill in all required fields."});
            }

            const ticketCount = await tickets.countDocuments();
            const ticketID = `TKT-${String(ticketCount + 1).padStart(4, '0')}`;
            
            const user = await employees.findById(createdBy);
            const teamID = user.teamID;

            const newTicket = new tickets({
                ticketID,
                title,
                description,
                category,
                priority: priority || 'Medium',
                createdBy,
                assignedTo: assignedTo || null,
                teamID,
                tags: tags || []
            });
            
            await newTicket.save();
            
            // Add ticket to creator's tickets array
            await employees.findByIdAndUpdate(createdBy, {
                $push: { tickets: newTicket._id }
            });
            
            // Add ticket to assignee's assignedTickets array if assigned
            if (assignedTo) {
                await employees.findByIdAndUpdate(assignedTo, {
                    $push: { assignedTickets: newTicket._id }
                });
            }
            
            res.status(201).json({
                msg: "Ticket created successfully",
                ticket: newTicket
            });
        }
        catch(err){
            console.error("Error creating ticket:", err);
            return res.status(500).json({msg : err.message});
        }
    },
    getMyTickets: async (req, res) => {
        try{
            const userID = req.employee.id;

            const myTickets = await tickets.find({ createdBy: userID })
                .populate('assignedTo', 'userID role')
                .populate('createdBy', 'userID')
                .sort({ createdAt: -1 });

            res.json(myTickets);
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getAssignedTickets : async (req, res) => {
        try{
            const userID = req.employee.id;

            const assignedTickets = await tickets.find({ assignedTo: userID })
                .populate('assignedTo', 'userID role')
                .populate('createdBy', 'userID')
                .sort({ createdAt: -1 });
            res.json(assignedTickets);
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getAllTickets: async (req, res) => {
        try {
            const userID = req.employee.id;
            const user = await employees.findById(userID);
            
            let query = {};
            
            // If user is a manager, show all tickets from their team
            if (user.role === 'Team Manager') {
                const managerTeams = await teams.find({ managerID: userID });
                const teamIDs = managerTeams.map(team => team._id);
                query = {
                    $or: [
                        { teamID: { $in: teamIDs } },
                        { assignedTo: userID },
                        { createdBy: userID }
                    ]
                };
            } else {
                // Regular employees see their own tickets and tickets assigned to them
                query = {
                    $or: [
                        { createdBy: userID },
                        { assignedTo: userID }
                    ]
                };
            }
            
            const allTickets = await tickets.find(query)
                .populate('createdBy', 'userID role')
                .populate('assignedTo', 'userID role')
                .populate('teamID', 'teamName')
                .sort({ createdAt: -1 });
                
            res.json(allTickets);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateTicketStatus: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const { status } = req.body;
            const userID = req.employee.id;
            
            if (!status) {
                return res.status(400).json({ msg: "Status is required" });
            }
            
            const ticket = await tickets.findById(ticketId);
            if (!ticket) {
                return res.status(404).json({ msg: "Ticket not found" });
            }
            
            // Check if user has permission to update status
            const user = await employees.findById(userID);
            const canUpdate = ticket.createdBy.toString() === userID ||
                            ticket.assignedTo?.toString() === userID ||
                            user.role === 'Team Manager';
            
            if (!canUpdate) {
                return res.status(403).json({ msg: "You don't have permission to update this ticket" });
            }
            
            const updateData = { 
                status, 
                updatedAt: new Date() 
            };
            
            if (status === 'Resolved' || status === 'Closed') {
                updateData.resolvedAt = new Date();
            }

            const updatedTicket = await tickets.findByIdAndUpdate(
                ticketId,
                updateData,
                { new: true }
            ).populate('createdBy', 'userID role')
             .populate('assignedTo', 'userID role');
            
            res.json({
                msg: "Ticket status updated successfully",
                ticket: updatedTicket
            });
            
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    assignTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const { assignedTo } = req.body;
            const userID = req.employee.id;

            const ticket = await tickets.findById(ticketId);
            if (!ticket) {
                return res.status(404).json({ msg: "Ticket not found" });
            }
            const user = await employees.findById(userID);
            const canAssign = ticket.createdBy.toString() === userID || user.role === 'Team Manager';
            if (!canAssign) {
                return res.status(403).json({ msg: "You don't have permission to assign this ticket" });
            }
            // Remove from previous assignee if exists
            if (ticket.assignedTo) {
                await employees.findByIdAndUpdate(ticket.assignedTo, {
                    $pull: { assignedTickets: ticketId }
                });
            }
            // Update ticket assignment
            const updatedTicket = await tickets.findByIdAndUpdate(
                ticketId,
                { 
                    assignedTo: assignedTo || null,
                    status: assignedTo ? 'In Progress' : 'Open',
                    updatedAt: new Date()
                },
                { new: true }
            ).populate('createdBy', 'userID role')
             .populate('assignedTo', 'userID role');

             // Add to new assignee if provided
            if (assignedTo) {
                await employees.findByIdAndUpdate(assignedTo, {
                    $push: { assignedTickets: ticketId }
                });
            }
            
            res.json({
                msg: "Ticket assigned successfully",
                ticket: updatedTicket
            });
            
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    addResponse: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const { responseText, isInternal, responseType } = req.body;
            const respondedBy = req.employee.id;
            
            if (!responseText) {
                return res.status(400).json({ msg: "Response text is required" });
            }
            
            const ticket = await tickets.findById(ticketId);
            if (!ticket) {
                return res.status(404).json({ msg: "Ticket not found" });
            }
            
            const response = new ticketResponses({
                ticketID: ticketId,
                respondedBy,
                responseText,
                isInternal: isInternal || false,
                responseType: responseType || 'Response'
            });
            
            await response.save();
            
            // Add response to ticket
            await tickets.findByIdAndUpdate(ticketId, {
                $push: { responses: response._id },
                updatedAt: new Date()
            });
            const populatedResponse = await ticketResponses.findById(response._id)
                .populate('respondedBy', 'userID role');
            
            res.status(201).json({
                msg: "Response added successfully",
                response: populatedResponse
            });
            
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getTicketDetails: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const userID = req.employee.id;
            
            const ticket = await tickets.findById(ticketId)
                .populate('createdBy', 'userID role')
                .populate('assignedTo', 'userID role')
                .populate('teamID', 'teamName')
                .populate({
                    path: 'responses',
                    populate: {
                        path: 'respondedBy',
                        select: 'userID role'
                    }
                });
            
            if (!ticket) {
                return res.status(404).json({ msg: "Ticket not found" });
            }
            
            // Check if user has permission to view this ticket
            const user = await employees.findById(userID);
            const canView = ticket.createdBy._id.toString() === userID ||
                          ticket.assignedTo?._id.toString() === userID ||
                          user.role === 'Team Manager';
            
            if (!canView) {
                return res.status(403).json({ msg: "You don't have permission to view this ticket" });
            }
            res.json(ticket);
            
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // Add this method to your ticketCtrl object
    getTeamMembersForTickets: async (req, res) => {
        try {
            const userID = req.employee.id;
            const user = await employees.findById(userID);
            
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            let teamMembers = [];
            
            if (user.role === 'Team Manager') {
                // Get teams managed by this manager
                const managerTeams = await teams.find({ managerID: userID })
                    .populate('members', 'userID role _id');
                
                // Collect all team members from all teams managed by this manager
                managerTeams.forEach(team => {
                    teamMembers = teamMembers.concat(team.members);
                });
            } else {
                // For regular employees, get their team members (including manager)
                if (user.teamID) {
                    const userTeam = await teams.findById(user.teamID)
                        .populate('members', 'userID role _id')
                        .populate('managerID', 'userID role _id');
                    
                    if (userTeam) {
                        teamMembers = [...userTeam.members];
                        // Include the manager in the list
                        if (userTeam.managerID) {
                            teamMembers.push(userTeam.managerID);
                        }
                    }
                }
            }

            // Remove duplicates and exclude the current user
            const uniqueMembers = teamMembers.filter((member, index, self) => 
                member._id.toString() !== userID.toString() && 
                self.findIndex(m => m._id.toString() === member._id.toString()) === index
            );

            res.json(uniqueMembers);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    // getTicketStatistics: async (req, res) => {
    //     try {
    //         const userID = req.employee.id;
    //         const user = await employees.findById(userID);
            
    //         let query = {};
            
    //         if (user.role === 'Team Manager') {
    //             const managerTeams = await teams.find({ managerID: userID });
    //             const teamIDs = managerTeams.map(team => team._id);
    //             query = { teamID: { $in: teamIDs } };
    //         } else {
    //             query = {
    //                 $or: [
    //                     { createdBy: userID },
    //                     { assignedTo: userID }
    //                 ]
    //             };
    //         }
            
    //         const stats = await tickets.aggregate([
    //             { $match: query },
    //             {
    //                 $group: {
    //                     _id: '$status',
    //                     count: { $sum: 1 }
    //                 }
    //             }
    //         ]);
            
    //         const categoryStats = await tickets.aggregate([
    //             { $match: query },
    //             {
    //                 $group: {
    //                     _id: '$category',
    //                     count: { $sum: 1 }
    //                 }
    //             }
    //             ]);
            
    //         const priorityStats = await tickets.aggregate([
    //             { $match: query },
    //             {
    //                 $group: {
    //                     _id: '$priority',
    //                     count: { $sum: 1 }
    //                 }
    //             }
    //         ]);
            
    //         res.json({
    //             statusStats: stats,
    //             categoryStats,
    //             priorityStats
    //         });
            
    //     } catch (err) {
    //         return res.status(500).json({ msg: err.message });
    //     }
    // }
    getTicketStatistics: async (req, res) => {
    try {
            const userID = req.employee.id;
            const user = await employees.findById(userID);
            
            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }
            
            let query = {};
            
            if (user.role === 'Team Manager') {
                // For Team Managers: Show stats for all teams they manage
                const managerTeams = await teams.find({ managerID: userID });
                const teamIDs = managerTeams.map(team => team._id);
                query = { teamID: { $in: teamIDs } };
            } else if (user.teamID) {
                // For Team Members: Show stats for their team
                query = { teamID: user.teamID };
            } else {
                // For users not in any team: Show only their own tickets
                query = {
                    $or: [
                        { createdBy: userID },
                        { assignedTo: userID }
                    ]
                };
            }
            
            console.log("Statistics query for user:", user.userID, "Query:", query);
            
            // Get status statistics
            const statusStats = await tickets.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            // Get category statistics
            const categoryStats = await tickets.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            // Get priority statistics
            const priorityStats = await tickets.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$priority',
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            // Get total count for verification
            const totalTickets = await tickets.countDocuments(query);
            
            console.log("Statistics results:", {
                totalTickets,
                statusStats,
                categoryStats,
                priorityStats
            });
            
            res.json({
                statusStats,
                categoryStats,
                priorityStats,
                totalTickets, // Add this for debugging
                teamInfo: user.teamID ? { teamID: user.teamID } : null // Add team info for debugging
            });
            
        } catch (err) {
            console.error("Error getting ticket statistics:", err);
            return res.status(500).json({ msg: err.message });
        }
    }
};
module.exports = ticketCtrl;