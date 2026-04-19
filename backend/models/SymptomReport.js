const mongoose = require('mongoose');

const SymptomReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    symptoms: {
        type: [String],
        required: true
    },
    possibleDiseases: [
        {
            name: { type: String, required: true },
            severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
            probability: { type: Number } 
        }
    ],
    advice: {
        type: String,
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    isFlaggedWrong: {
        type: Boolean,
        default: false
    },
    adminNotes: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('SymptomReport', SymptomReportSchema);
