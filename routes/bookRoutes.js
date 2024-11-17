const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { verifyToken } = require('../middleware/auth'); // Ensure user is authenticated

// Add a Book
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, author, genre, condition } = req.body;
        const newBook = new Book({
            title,
            author,
            genre,
            condition,
            owner: req.user.id // ID from the logged-in user
        });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add book' });
    }
});

// Get All Books and Search Books
router.get('/', async (req, res) => {
    try {
        const { title, author, genre } = req.query;

        const filter = {};
        if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
        if (author) filter.author = { $regex: author, $options: 'i' };
        if (genre) filter.genre = genre;

        // Fetch books based on filter (if search parameters are provided)
        const books = await Book.find(filter).populate('owner', 'name email');
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Edit a Book
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        // Ensure only the owner can edit
        if (book.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        Object.assign(book, req.body); // Update fields
        await book.save();
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// Delete a Book
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        // Ensure only the owner can delete
        if (book.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await book.deleteOne();
        res.status(200).json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

module.exports = router;
