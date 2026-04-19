const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dosage: {
        type: String, // e.g., "300mg" or "1 Tablet"
        required: true
    },
    frequency: {
        type: String, // e.g., "Daily", "Twice a day"
        default: "Daily"
    },
    timeOfDay: {
        type: String, // e.g., "After Breakfast", "Before Dinner"
        default: "Anytime"
    },
    reminderEnabled: {
        type: Boolean,
        default: true
    },
    colorTheme: {
        type: String, // e.g., "green", "pink", "blue" for the CSS pill rendering
        default: "blue"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('medicine', MedicineSchema);
