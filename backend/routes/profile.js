const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const Health = require("../models/Health");
const Medicine = require("../models/Medicine");
const SymptomReport = require("../models/SymptomReport");
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// UPDATE PROFILE
router.post("/update", fetchuser, upload.single("image"), async (req, res) => {
  try {
    const { name, phone, age, gender, bloodGroup } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        age,
        gender,
        bloodGroup,
        ...(req.file && { image: req.file.filename }),
      },
      { new: true }
    );

    res.json({ user: updatedUser });

  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// DELETE ACCOUNT AND ALL ASSOCIATED DATA
router.delete("/delete", fetchuser, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    await Health.deleteMany({ user: req.user.id });
    await Medicine.deleteMany({ user: req.user.id });
    await SymptomReport.deleteMany({ user: req.user.id });

    res.json({ success: true, message: "Account and medical vault purged." });
  } catch (err) {
    res.status(500).json({ message: "Error purging account" });
  }
});

module.exports = router;