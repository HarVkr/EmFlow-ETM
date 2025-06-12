const mongoose = require('mongoose');

const TicketResponseSchema = new mongoose.Schema({
    ticketID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tickets',
        required: true
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    responseText: {
        type: String,
        required: true,
        maxLength: 2000
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isInternal: {
        type: Boolean,
        default: false // Internal notes vs public responses
    },
    responseType: {
        type: String,
        enum: ['Response', 'Status Update', 'Internal Note'],
        default: 'Response'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ticketresponses', TicketResponseSchema);