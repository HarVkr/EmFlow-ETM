const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['Admin', 'Team Member', 'Team Manager'],
        required: true 
    },
    tasks: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    },
    events: {
        type: Array,
        default: []
    },
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams'
    },
    tickets : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tickets'
    }],
    assignedTickets : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tickets'
    }]
});

module.exports = mongoose.model('employees', UserSchema);