const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email required' });
        }
        if (!password || typeof password !== 'string' || password.length < 8 || password.length > 100) {
            return res.status(400).json({ error: 'Password must be between 8 and 100 characters' });
        }

        const existingInfo = await User.findOne({ email });
        if (existingInfo) return res.status(400).json({ error: 'Email already in use' });

        const user = new User({ email, password });
        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({ user: { id: user._id, email: user.email }, token });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to sign up.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.json({ user: { id: user._id, email: user.email }, token });
    } catch (err) {
        res.status(500).json({ error: err.message || 'Failed to login.' });
    }
});

// Get Current User
router.get('/me', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
