const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    managerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees'
    }]
});

module.exports = mongoose.model('teams', TeamSchema);