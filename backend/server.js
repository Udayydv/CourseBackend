// ------------------- IMPORTS -------------------
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// ------------------- CONFIG -------------------
dotenv.config();
const app = express();

// ------------------- CORS CONFIG -------------------
// ✅ Allow requests only from your Vercel frontend and local dev
const allowedOrigins = [
  "https://hackathon-7wwl.vercel.app", // your Vercel frontend domain
  "http://localhost:5173"              // local dev for Vite
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------- STATIC FILES -------------------
app.use('/uploads', express.static('uploads'));

// ------------------- ROUTES -------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/creator', require('./routes/creator'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/enroll', require('./routes/enrollment'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/certificates', require('./routes/certificates'));

// ------------------- DATABASE -------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ------------------- HEALTH CHECK -------------------
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is working!', status: 'OK' });
});

// ------------------- SERVER -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
