const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notification = require('../models/Notification');

// FETCH ALL NOTIFICATIONS FOR USER
router.get('/fetchall', fetchuser, async (req, res) => {
    try {
        const notifications = await Notification
            .find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// MARK NOTIFICATION AS READ
router.put('/mark-read/:id', fetchuser, async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) return res.status(404).send("Not Found");
        if (notification.userId.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// DELETE NOTIFICATION
router.delete('/delete/:id', fetchuser, async (req, res) => {
    try {
        let notification = await Notification.findById(req.params.id);

        if (!notification) return res.status(404).send("Not Found");
        if (notification.userId.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        await Notification.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
