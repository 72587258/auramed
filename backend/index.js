const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Static folder for images
app.use('/uploads', express.static('uploads'));

// ================= ROUTES =================

// 🔐 Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ❤️ Health Routes
const healthRoutes = require('./routes/health');
app.use('/api/health', healthRoutes);

// 🤖 AI Routes
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);

// 👤 Profile Routes (NEW)
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// 💊 Medication Routes (NEW)
const medicationRoutes = require('./routes/medication');
app.use('/api/medication', medicationRoutes);

// 🛡️ Admin Routes (NEW)
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

// 🔔 Notification Routes (NEW)
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// ==========================================

// ✅ MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));

// ✅ Test Route
app.get('/', (req, res) => {
  res.send("AI Health Backend mast chal raha hai 🚀");
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🚀`);
});