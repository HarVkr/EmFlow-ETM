const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ticketID : {
        type : String,
        unique : true,
        required : true
    },
    title : {
        type : String, 
        required : true,
        maxLength : 200
    },
    description : {
        type : String,
        required : true,
        maxLength : 2000
    },
    category: {
        type: String,
        enum: ['Technical', 'HR', 'Administrative', 'Equipment', 'Other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Resolved', 'Closed', 'Reopened'],
        default: 'Open'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employees',
        required: false // Can be null if not assigned yet
    },
    teamID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams',
        required: false // Optional team context
    },
    attachments: [{
        fileName: String,
        fileUrl: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    responses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ticketresponses'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date,
        required: false
    },
    tags: [String] // For better categorization
});
module.exports = mongoose.model('tickets', TicketSchema);