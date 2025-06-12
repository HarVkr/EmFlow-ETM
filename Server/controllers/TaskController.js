const tasks = require('../models/Task');
const employees = require('../models/User');
const mongoose = require('mongoose');
const teams = require('../models/Team')

const taskCtrl = {
    // createTask: async (req, res) => {
    //     const employeeMongoIDs = [];
    //     const employeeIDsArray = [];
    //     try {
    //         //const { taskID, taskName, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate } = req.body;
    //         // const newTask = req.body;
    //         // console.log(newTask);
    //         // const { taskName, taskID, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate } = newTask;
    //         // console.log(employeeIDs);
    //         const newTask = req.body;  // Access the nested task object
    //         console.log(newTask);
    //         const {
    //             taskName,
    //             taskID,
    //             taskDescription,
    //             taskDeadline,
    //             status,
    //             employeeIDs,
    //             managerID,
    //             creationDate,
    //             teamID
    //         } = newTask;
    //         console.log(employeeIDs);

    //         // const requiredFields = { taskID, taskName, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate };
    //         //     for (const [field, value] of Object.entries(requiredFields)) {
    //         //         if (!value) {
    //         //             return res.status(400).json({ msg: `Please fill in the ${field} field.` });
    //         //         }
    //         //     }

    //         // if (!taskName || !taskID || !taskDescription || !taskDeadline || !status || !employeeIDs || !managerID || !creationDate) 
    //         //     return res.status(400).json({ msg: "Please fill in all fields." });

    //         // Create the task with team association if provided
    //         const taskData = {
    //             taskName,
    //             taskID,
    //             taskDescription,
    //             taskDeadline,
    //             status: status || 'Not Started',
    //             employeeIDs,
    //             managerID,
    //             creationDate: creationDate || new Date().toISOString()
    //         };

    //         // Add teamID if provided
    //         if (teamID) {
    //             // Verify team exists
    //             const team = await teams.findById(teamID);
    //             if (!team) {
    //                 return res.status(404).json({ msg: "Team not found." });
    //             }

    //             // Verify manager owns this team
    //             if (team.managerID.toString() !== managerID.toString()) {
    //                 return res.status(403).json({
    //                     msg: "You can only create tasks for teams you manage."
    //                 });
    //             }

    //             taskData.teamID = teamID;
    //         }

    //         const task = new tasks(taskData);

    //         const employeeMongoIDs = employeeIDs.map(employee => employee._id);
    //         console.log(employeeMongoIDs);

    //         for (let i = 0; i < employeeIDs.length; i++) {
    //             const employeeObjectID = new mongoose.Types.ObjectId(employeeIDs[i]);
    //             employeeMongoIDs.push(employeeObjectID);
    //         }
    //         const managerObjectId = new mongoose.Types.ObjectId(managerID);
    //         console.log(managerObjectId);

    //         // if (typeof taskName !== 'string' || typeof taskID !== 'string' || typeof taskDescription !== 'string' || 
    //         //     typeof taskDeadline !== 'string' || typeof status !== 'string' || !Array.isArray(employeeIDs) || 
    //         //     !mongoose.Types.ObjectId.isValid(managerObjectId) || typeof creationDate !== 'string' || 
    //         //     !employeeMongoIDs.every(id => mongoose.Types.ObjectId.isValid(id))) {
    //         //     return res.status(400).json({ msg: "Invalid data format." });
    //         // }
    //         // console.log(taskName, taskID, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate);

    //         // const task = new tasks({
    //         //     taskName, taskID, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate, teamID
    //         // });

    //         for (const employeeID of employeeIDs) {
    //             const employeeObjectId = new mongoose.Types.ObjectId(employeeID);
    //             const assignedEmployee = await employees.findById(employeeObjectId);

    //             if (!assignedEmployee) return res.status(400).json({ msg: "Employee not found." });

    //             // if(!assignedEmployee.tasks){
    //             //     assignedEmployee.tasks = [];
    //             // }
    //             // assignedEmployee.tasks.push(task);
    //             // await assignedEmployee.save();
    //             // If task is team-based, verify employee belongs to the team
    //             if (teamID && assignedEmployee.teamID?.toString() !== teamID.toString()) {
    //                 return res.status(400).json({
    //                     msg: `Employee with ID ${employeeID} is not part of the specified team.`
    //                 });
    //             }

    //             // Add task to employee's tasks array
    //             if (!assignedEmployee.tasks) {
    //                 assignedEmployee.tasks = [];
    //             }
    //             assignedEmployee.tasks.push(task);
    //             await assignedEmployee.save();
    //         }


    //         //const employeeObjectId = new mongoose.Types.ObjectId(employeeID);

    //         // const assignedEmployee = await employees.findById(employeeObjectId);
    //         // if (!assignedEmployee) return res.status(400).json({ msg: "Employee not found." });

    //         // if (!assignedEmployee.tasks) {
    //         //     assignedEmployee.tasks = [];
    //         // }

    //         // assignedEmployee.tasks.push(task);

    //         // await assignedEmployee.save();
    //         //const newTask = {...task , managerID: managerObjectId};
    //         await task.save();
    //         res.json({ msg: `Task created and assigned to Employees: ${employeeIDs.join(', ')}` });
    //     } catch (err) {
    //         return res.status(500).json({ msg: err.message });
    //     }
    // },
    getAssignedTasks: async (req, res) => {
        try {
            const managerID = req.user._id;  // Assuming you're using JWT and `req.user` has the logged-in manager's ID
            //console.log(req);

            // Find tasks where the current manager is the one who assigned the task
            // const assignedTasks = await tasks.find({ managerID });  // Fetch employees as well
            const assignedTasks = await tasks.find({ managerID })
                .populate('employeeIDs', 'userID')
                .populate('teamID', 'teamName');

            res.json(assignedTasks);  // Send the tasks back to the frontend
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getTeamTasks: async (req, res) => {
        try {
            const { teamID } = req.params;

            // Find tasks assigned to the team
            const teamTasks = await tasks.find({ teamID })
                .populate('employeeIDs', 'userID')
                .populate('managerID', 'userID');

            res.json(teamTasks);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateTaskProgress: async (req, res) => {
        // try {
        //     const { status } = req.body;
        //     if (!status) return res.status(400).json({ msg: "Please fill in all fields." });
        //     await tasks.findOneAndUpdate({_id: req.params.id}, { status });
        //     await employees.updateMany({ "tasks._id": req.params.id }, { $set: {"tasks.$.status": status }});
        //     // const { taskID, taskName, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate, teamID } = req.body;

        //     // const employeeObjectIds = employeeIDs.map(id => ObjectId(id));

        //     // const newTask = { taskID, taskName, taskDescription, taskDeadline, status, employeeIDs: employeeObjectIds, managerID, creationDate, teamID };
        //     //await tasks.findOneAndUpdate({ _id: req.params.id }, newTask);
        //     res.json({ msg: "Task updated successfully." });
        // } catch (err) {
        //     return res.status(500).json({ msg: err.message });
        // }
        try {
            const { status } = req.body;
            if (!status) return res.status(400).json({ msg: "Please fill in all fields." });

            // First update the task in tasks collection
            const updatedTask = await tasks.findOneAndUpdate(
                { _id: req.params.id },
                { status },
                { new: true }
            );

            if (!updatedTask) {
                return res.status(404).json({ msg: "Task not found" });
            }

            // Update the task status in all employees' tasks arrays who are assigned this task
            const result = await employees.updateMany(
                { "tasks._id": new mongoose.Types.ObjectId(req.params.id) },
                {
                    "$set": {
                        "tasks.$[elem].status": status
                    }
                },
                {
                    arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(req.params.id) }]
                }
            );

            res.json({
                msg: "Task updated successfully.",
                task: updatedTask
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getTasksByTeam: async (req, res) => {
        try {
            const userID = req.employee.id;

            // Get user's team
            const user = await employees.findById(userID);
            if (!user || !user.teamID) {
                return res.status(404).json({ msg: "User is not part of any team" });
            }

            // Find tasks assigned to the team
            const teamTasks = await tasks.find({ teamID: user.teamID })
                .populate('employeeIDs', 'userID')
                .populate('managerID', 'userID')
                .populate('teamID', 'teamName');

            res.json(teamTasks);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createAndAssignTask: async (req, res) => {
        try {
            const {
                taskName,
                taskID,
                taskDescription,
                taskDeadline,
                status,
                assignEntireTeam,
                employeeIDs, // Optional: specific employees if not assigning to entire team
                creationDate
            } = req.body;
            teamID = req.params.teamID || req.body.teamID; // Get teamID from params or body
            // Validate required fields
            if (!taskName || !taskID || !taskDescription || !taskDeadline) {
                return res.status(400).json({ msg: "Please provide all required task details." });
            }

            if (!teamID) {
                return res.status(400).json({ msg: "Team ID is required." });
            }

            // Get manager ID from authenticated user
            const managerID = req.user._id;

            // Verify team exists
            const team = await teams.findById(teamID);
            if (!team) {
                return res.status(400).json({ msg: "Team not found." });
            }

            // Verify manager owns this team
            if (team.managerID.toString() !== managerID.toString()) {
                return res.status(403).json({
                    msg: "You can only create tasks for teams you manage."
                });
            }

            // Determine which employees to assign the task to
            let targetEmployees = [];

            if (assignEntireTeam === true) {
                // Assign to all team members
                targetEmployees = [...team.members];
            } else {
                // Assign to specific employees
                if (!employeeIDs || !employeeIDs.length) {
                    return res.status(400).json({ msg: "Please specify employees or choose to assign to the entire team." });
                }

                // Verify all employees are part of the team
                const teamMemberIds = team.members.map(member => member.toString());
                const invalidEmployees = employeeIDs.filter(id => !teamMemberIds.includes(id.toString()));

                if (invalidEmployees.length > 0) {
                    return res.status(400).json({
                        msg: "Some employees are not part of this team.",
                        invalidEmployees
                    });
                }

                targetEmployees = employeeIDs;
            }

            // Create the task
            const task = new tasks({
                taskName,
                taskID,
                taskDescription,
                taskDeadline,
                status: status || 'Not Started',
                employeeIDs: targetEmployees,
                managerID,
                creationDate: creationDate || new Date().toISOString(),
                teamID
            });
            if (!team.tasks) {
                team.tasks = [];
            }
            team.tasks.push(task);
            await team.save();

            // Save the task first to get its ID
            await task.save();
            // Also save the task in the team's tasks array

            // Add task to each target employee's tasks array
            const updatedEmployees = [];
            for (const employeeID of targetEmployees) {
                const employee = await employees.findById(employeeID);

                if (!employee) {
                    console.warn(`Employee with ID ${employeeID} not found`);
                    continue;
                }

                // Add task to employee's tasks array
                if (!employee.tasks) {
                    employee.tasks = [];
                }

                employee.tasks.push(task);
                await employee.save();
                updatedEmployees.push(employee.userID);
            }

            // Return success with details
            res.status(201).json({
                msg: "Task created and assigned successfully.",
                task,
                assignedTo: assignEntireTeam ? "Entire Team" : "Specific Members",
                teamID: team._id,
                teamName: team.teamName,
                assignedEmployees: updatedEmployees,
                targetEmployeeCount: targetEmployees.length
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}
module.exports = taskCtrl;