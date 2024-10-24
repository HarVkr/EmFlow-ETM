const mongoose = require('mongoose');
const events = require('../models/Event');
const employees = require('../models/User');

const eventCtrl = {
    createEvent: async (req, res) => {
        try{
            const {eventName, eventID, eventDescription, eventDate, eventLocation, 
                creationDate, invitedEmployees} = req.body;
            if(!eventName || !eventID || !eventDescription || !eventDate || !eventLocation 
                || !creationDate || !invitedEmployees) 
                return res.status(400).json({msg: "Please fill in all fields."});

            console.log(typeof invitedEmployees);
            
            //const invitedEmployeeIDs = invitedEmployees.split(',');
            let invitedEmployeeIDs;
            // if (typeof invitedEmployees === 'object' && !Array.isArray(invitedEmployees)) {
            //     invitedEmployeeIDs = Object.values(invitedEmployees);
            // } else {
            //     return res.status(400).json({ msg: "Invalid format for invitedEmployees." });
            // }
            //let invitedEmployeeIDs;
            if (Array.isArray(invitedEmployees)) {
                invitedEmployeeIDs = invitedEmployees;
            } else if (typeof invitedEmployees === 'string') {
                invitedEmployeeIDs = invitedEmployees.split(',').map(id => id.trim());
            } else {
                return res.status(400).json({ msg: "Invalid format for invitedEmployees. It should be an array or a comma-separated string." });
            }

            for (const employeeID of invitedEmployeeIDs) {
                if (!mongoose.Types.ObjectId.isValid(employeeID.trim())) {
                    return res.status(400).json({ msg: `Invalid employee ID: ${employeeID}` });
                }
            }

            const event = new events({
                eventName, eventID, eventDescription, eventDate, eventLocation, creationDate, invitedEmployees: invitedEmployeeIDs
            });
            //console.log(req.user._id);
            await event.save();

            for(const employeeID of invitedEmployeeIDs){
                const employeeObjectId = new mongoose.Types.ObjectId(employeeID.trim());
                await employees.findByIdAndUpdate(employeeObjectId, {
                    $push: { events: event }
                });
            }
            await employees.findByIdAndUpdate(req.user._id, {
                $push: { events: event }
            });
            res.json({msg: `Event created and Employees invited Sucessfully.`});
        }
        catch(err){
            return res.status(500).json({msg: err.message});
        }
    },
    getEvents : async (req, res) => {
        try{
            const employee = await employees.findById(req.employee.id);
            
            if(!employee) return res.status(400).json({msg: "Employee not found."});

            const eventDetails = await events.find({ '_id': { $in: employee.events } });
            res.json(eventDetails);
        }catch(err){
            return res.status(500).json({msg: err.message});
        }
    }
}

module.exports = eventCtrl;