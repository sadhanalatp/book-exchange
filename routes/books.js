const express = require('express');
const Book = require('../models/Book');

const router = express.Router();

// Add a book
router.post('/', async (req, res) => {
    const { title, author, genre, condition, availability, owner } = req.body;
    try {
        const newBook = new Book({ title, author, genre, condition, availability, owner });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ error: 'Error adding book' });
    }
});

// Get books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching books' });
    }
});

module.exports = router;
