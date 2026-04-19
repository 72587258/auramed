const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Health = require('../models/Health');

// 1. ADD DATA AND CALCULATE BMI
router.post('/add', fetchuser, async (req, res) => {
    try {
        const { age, weight, height } = req.body;

        // Validation
        if (!age || !weight || !height) {
            return res.status(400).json({ message: "All fields (age, weight, height) are required." });
        }

        if (age <= 0 || weight <= 0 || height <= 0) {
            return res.status(400).json({ message: "Values must be greater than 0." });
        }

        // Convert height to meters
        const heightInMeters = height / 100;

        // Calculate BMI (as number)
        const bmi = parseFloat((weight / (heightInMeters ** 2)).toFixed(2));

        // Determine BMI category (more accurate)
        let bmiCategory = "";
        if (bmi < 18.5) bmiCategory = "Underweight";
        else if (bmi >= 18.5 && bmi < 25) bmiCategory = "Normal";
        else if (bmi >= 25 && bmi < 30) bmiCategory = "Overweight";
        else bmiCategory = "Obese";

        // Save data to database
        const newRecord = new Health({
            age,
            weight,
            height,
            bmi,
            bmiCategory,
            user: req.user.id
        });

        const savedRecord = await newRecord.save();

        res.json({
            message: "Health data saved successfully! 💪",
            data: savedRecord
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// 2. FETCH ALL HEALTH RECORDS
router.get('/fetchall', fetchuser, async (req, res) => {
    try {
        const records = await Health
            .find({ user: req.user.id })
            .sort({ date: -1 });

        res.json(records);

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
// 3. DELETE RECORD
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        let record = await Health.findById(req.params.id);

        if (!record) return res.status(404).send("Not Found");

        if (record.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        await Health.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Deleted successfully" });

    } catch (error) {
        res.status(500).send("Server Error");
    }
});

// 4. UPDATE RECORD
router.put('/update/:id', fetchuser, async (req, res) => {
    try {
        const { age, weight, height } = req.body;

        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters ** 2)).toFixed(2);

        let bmiCategory = "";
        if (bmi < 18.5) bmiCategory = "Underweight";
        else if (bmi < 25) bmiCategory = "Normal";
        else if (bmi < 30) bmiCategory = "Overweight";
        else bmiCategory = "Obese";

        const updated = await Health.findByIdAndUpdate(
            req.params.id,
            { age, weight, height, bmi, bmiCategory },
            { new: true }
        );

        res.json(updated);

    } catch (error) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;