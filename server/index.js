require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const teacherRoutes = require('./routes/teachers');

const app  = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL]
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/teachers', teacherRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Admin verify
app.post('/api/admin/verify', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    res.json({ ok: true });
  } else {
    res.status(401).json({ ok: false, message: 'Wrong password' });
  }
});

// Connect to MongoDB then start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () => console.log(`🚀  Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

