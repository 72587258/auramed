const mongoose = require('mongoose');

const HealthSchema = new mongoose.Schema({
    user: { // Ye batayega ki ye data kis user ka hai
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    age: { type: Number, required: true },
    weight: { type: Number, required: true }, // kg mein
    height: { type: Number, required: true }, // cm mein
    bmi: { type: Number },
    bmiCategory: { type: String }, // Normal, Underweight, Overweight
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Health', HealthSchema);