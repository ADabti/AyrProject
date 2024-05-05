// server/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Import your custom Socket.IO configuration
const socketConfig = require('./auth/socket'); // Adjust the path as necessary to match your file structure
const io = socketConfig.initialize(server); // This sets up and returns the Socket.IO instance

const clickRoutes = require('./routes/clickRoutes');
const authRoutes = require('./routes/authRoutes');

// Configure CORS and other middlewares
app.use(cors({
  origin: ["http://ayrproject.s3-website.us-east-2.amazonaws.com", "https://ayrproject.onrender.com","http://localhost:5000", "http://localhost:3000"], // Match the client's origin for Express routes
  credentials: true // Enable credentials to allow sending cookies and auth headers
}));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

// Setup routes
app.use('/api', clickRoutes);
app.use('/api/users', authRoutes);

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
