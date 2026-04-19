const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/mailer');

const router = express.Router();

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = email === 'akshaypanchal1943@gmail.com' ? 'admin' : 'user';
    const newUser = new User({ name, email, password: hashedPassword, role: userRole });
    await newUser.save();

    // ✉️ Send Welcome Email (non-blocking)
    sendWelcomeEmail(email, name);

    res.status(201).json({ message: "Account created successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Account does not exist!" });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ message: "Your account is currently blocked by an administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Assign admin role dynamically
    if (user.email === 'akshaypanchal1943@gmail.com' && user.role !== 'admin') {
        user.role = 'admin';
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;