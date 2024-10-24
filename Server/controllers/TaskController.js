const tasks = require('../models/Task');
const employees = require('../models/User');
const mongoose = require('mongoose');

const taskCtrl = {
    
    createTask: async (req, res) => {
        const employeeMongoIDs = [];
        const employeeIDsArray = [];
        try {
            //const { taskID, taskName, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate } = req.body;
            // const newTask = req.body;
            // console.log(newTask);
            // const { taskName, taskID, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate } = newTask;
            // console.log(employeeIDs);
            const newTask  = req.body;  // Access the nested task object
            console.log(newTask);
            const { taskName, taskID, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate, teamID} = newTask;
            console.log(employeeIDs);
            
            // const requiredFields = { taskID, taskName, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate };
            //     for (const [field, value] of Object.entries(requiredFields)) {
            //         if (!value) {
            //             return res.status(400).json({ msg: `Please fill in the ${field} field.` });
            //         }
            //     }
            
            // if (!taskName || !taskID || !taskDescription || !taskDeadline || !status || !employeeIDs || !managerID || !creationDate) 
            //     return res.status(400).json({ msg: "Please fill in all fields." });
            
            const employeeMongoIDs = employeeIDs.map(employee => employee._id);
            console.log(employeeMongoIDs);
            
            for(let i = 0; i < employeeIDs.length; i++){
                const employeeObjectID = new mongoose.Types.ObjectId(employeeIDs[i]);
                employeeMongoIDs.push(employeeObjectID);
            }
            const managerObjectId = new mongoose.Types.ObjectId(managerID);
            console.log(managerObjectId);

            // if (typeof taskName !== 'string' || typeof taskID !== 'string' || typeof taskDescription !== 'string' || 
            //     typeof taskDeadline !== 'string' || typeof status !== 'string' || !Array.isArray(employeeIDs) || 
            //     !mongoose.Types.ObjectId.isValid(managerObjectId) || typeof creationDate !== 'string' || 
            //     !employeeMongoIDs.every(id => mongoose.Types.ObjectId.isValid(id))) {
            //     return res.status(400).json({ msg: "Invalid data format." });
            // }
            // console.log(taskName, taskID, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate);
            
            const task = new tasks({
                taskName, taskID, taskDescription, taskDeadline, status, employeeIDs, managerID, creationDate, teamID
            });

            for(const employeeID of employeeIDs){
                const employeeObjectId = new mongoose.Types.ObjectId(employeeID);

                const assignedEmployee = await employees.findById(employeeObjectId);
                if (!assignedEmployee) return res.status(400).json({ msg: "Employee not found." });
                if(!assignedEmployee.tasks){
                    assignedEmployee.tasks = [];
                }
                assignedEmployee.tasks.push(task);
                await assignedEmployee.save();
            }


            //const employeeObjectId = new mongoose.Types.ObjectId(employeeID);

            // const assignedEmployee = await employees.findById(employeeObjectId);
            // if (!assignedEmployee) return res.status(400).json({ msg: "Employee not found." });

            // if (!assignedEmployee.tasks) {
            //     assignedEmployee.tasks = [];
            // }

            // assignedEmployee.tasks.push(task);

            // await assignedEmployee.save();
            //const newTask = {...task , managerID: managerObjectId};
            await task.save();
            res.json({ msg: `Task created and assigned to Employees: ${employeeIDs.join(', ')}` });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getAssignedTasks: async (req, res) => {
        try {
            const managerID = req.user._id;  // Assuming you're using JWT and `req.user` has the logged-in manager's ID
            //console.log(req);
            
            // Find tasks where the current manager is the one who assigned the task
            const assignedTasks = await tasks.find({ managerID });  // Fetch employees as well
            
            res.json(assignedTasks);  // Send the tasks back to the frontend
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

            res.json({ msg: "Task updated successfully.", modifiedCount: result.modifiedCount });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}
module.exports = taskCtrl;