const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const mongodb = require('./db/db');
const AuthRoutes = require('./routes/AuthRoutes');

// Allow requests from localhost:3000 and localhost:3001
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001','https://hr-portal-six-liart.vercel.app'],
  credentials: true, // Allow cookies/auth headers
}));

// Built-in middleware to parse JSON
app.use(express.json());

// Connect to MongoDB (your connection logic)
mongodb();

// API routes
app.use('/api', AuthRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
