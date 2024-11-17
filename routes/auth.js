const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = new User({ email, password: hashedPassword, name });
        await newUser.save();
        res.status(201).json({ message: 'User registered!' });
    } catch (err) {
        res.status(400).json({ error: 'Error creating user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, 'secretkey');
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
