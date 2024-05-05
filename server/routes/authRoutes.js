//authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema.js');

// Secret key for JWT signing
const JWT_SECRET = 'secret_key_test';

// POST /api/users/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already in use.' });
        }
        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user.', error: error.message });
    }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' }); 

        res.json({
            message: 'User logged in successfully',
            accessToken,
            refreshToken,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in.', error: error.message });
    }
});


//route to refresh token
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh Token is required.' });
    }
    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newAccessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' });
        res.json({
            accessToken: newAccessToken
        });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token.', error: error.message });
    }
});



module.exports = router;
