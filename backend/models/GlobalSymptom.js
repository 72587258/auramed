const mongoose = require('mongoose');

const GlobalSymptomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bodyZone: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GlobalSymptom', GlobalSymptomSchema);
