const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    taskID: {
        type: String,
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    taskDeadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    employeeIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees'
    }],
    managerID: {  // The manager who created the task
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',  // Refers to the Manager (who is also an employee)
        required: true
    },
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('tasks', TaskSchema);