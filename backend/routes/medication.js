const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Medicine = require('../models/Medicine');

// 1. ADD MEDICINE
router.post('/add', fetchuser, async (req, res) => {
    try {
        const { name, dosage, frequency, timeOfDay, reminderEnabled, colorTheme } = req.body;
        
        if (!name || !dosage) {
            return res.status(400).json({ error: "Name and dosage are required." });
        }

        const newMedicine = new Medicine({
            user: req.user.id,
            name, dosage, frequency, timeOfDay, reminderEnabled, colorTheme
        });

        const savedMedicine = await newMedicine.save();
        res.json({ message: "Medicine added successfully", data: savedMedicine });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// 2. FETCH ALL MEDICINES
router.get('/fetchall', fetchuser, async (req, res) => {
    try {
        const medicines = await Medicine.find({ user: req.user.id }).sort({ dateAdded: -1 });
        res.json(medicines);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// 3. TOGGLE REMINDER
router.put('/toggle/:id', fetchuser, async (req, res) => {
    try {
        let medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).send("Not Found");
        if (medicine.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            { $set: { reminderEnabled: !medicine.reminderEnabled } },
            { new: true }
        );
        res.json(medicine);
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// 4. DELETE MEDICINE
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        let medicine = await Medicine.findById(req.params.id);
        if (!medicine) return res.status(404).send("Not Found");
        if (medicine.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Medicine deleted" });
    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;
