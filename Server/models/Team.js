const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamID: {
        type: String,
        unique: true
    },
    managerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees'
    }],
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks'
    }],
});

module.exports = mongoose.model('teams', TeamSchema);