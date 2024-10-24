const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventID: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventLocation: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    invitedEmployees: {
        type: [String],
        default: []
    },
});
module.exports = mongoose.model('events', EventSchema);