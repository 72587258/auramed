const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const User = require('../models/User');
const SymptomReport = require('../models/SymptomReport');
const ChatLog = require('../models/ChatLog');
const SystemConfig = require('../models/SystemConfig');
const GlobalDisease = require('../models/GlobalDisease');
const GlobalMedicine = require('../models/Medicine'); 
const GlobalSymptom = require('../models/GlobalSymptom');

const router = express.Router();

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

/* =======================================
   1. USER MANAGEMENT OVERSIGHT
======================================= */
router.get('/users', fetchuser, checkAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

router.put('/user/:id/block', fetchuser, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.role === 'admin') return res.status(400).json({ error: "Cannot block another administrator." });
        
        user.status = user.status === 'blocked' ? 'active' : 'blocked';
        await user.save();
        res.json({ message: `User status changed to ${user.status}`, status: user.status });
    } catch (err) { res.status(500).send("Server Error"); }
});

router.delete('/user/:id/delete', fetchuser, checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.role === 'admin') return res.status(400).json({ error: "Cannot delete an administrator account." });
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User has been permanently deleted from the system." });
    } catch (err) { res.status(500).send("Server Error"); }
});

/* =======================================
   2. AI DIAGNOSTICS AUDIT & LOGS
======================================= */
router.get('/reports', fetchuser, checkAdmin, async (req, res) => {
    try {
        const reports = await SymptomReport.find().populate('user', 'name email').sort({ date: -1 });
        res.json(reports);
    } catch (err) { res.status(500).send("Server Error"); }
});

router.put('/reports/:id/flag', fetchuser, checkAdmin, async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const report = await SymptomReport.findById(req.params.id);
        if (!report) return res.status(404).json({ error: "Report not found" });

        report.isFlaggedWrong = !report.isFlaggedWrong;
        report.adminNotes = adminNotes || report.adminNotes;
        await report.save();
        res.json({ message: "Report flag updated successfully", report });
    } catch (err) { res.status(500).send("Server Error"); }
});

router.get('/chat-logs', fetchuser, checkAdmin, async (req, res) => {
    try {
        const logs = await ChatLog.find().populate('user', 'name email').sort({ date: -1 }).limit(100);
        res.json(logs);
    } catch (err) { res.status(500).send("Server Error"); }
});

/* =======================================
   3. AI NEURAL TUNING (PROMPT CONFIG)
======================================= */
router.get('/system-config', fetchuser, checkAdmin, async (req, res) => {
    try {
        const configs = await SystemConfig.find();
        res.json(configs);
    } catch (err) { res.status(500).send("Server Error"); }
});

router.post('/system-config', fetchuser, checkAdmin, async (req, res) => {
    try {
        const { key, value } = req.body;
        let config = await SystemConfig.findOne({ key });
        if (config) {
            config.value = value;
            config.lastUpdatedBy = req.user.id;
            config.updatedAt = Date.now();
        } else {
            config = new SystemConfig({ key, value, lastUpdatedBy: req.user.id });
        }
        await config.save();
        res.json({ message: "System prompt updated successfully", config });
    } catch (err) { res.status(500).send("Server Error"); }
});

/* =======================================
   4. GLOBAL MEDICAL DATABASE (Diseases/Symptoms)
======================================= */
router.get('/global-diseases', fetchuser, checkAdmin, async (req, res) => {
    try {
        const diseases = await GlobalDisease.find().sort({ name: 1 });
        res.json(diseases);
    } catch (err) { res.status(500).send("Server Error"); }
});

router.post('/global-diseases', fetchuser, checkAdmin, async (req, res) => {
    try {
        const { name, description, commonSymptoms, severity } = req.body;
        const disease = new GlobalDisease({ name, description, commonSymptoms, severity });
        await disease.save();
        res.json(disease);
    } catch (err) { res.status(500).json({ error: "Could not create disease, name might not be unique" }); }
});

module.exports = router;
