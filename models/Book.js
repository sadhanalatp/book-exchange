const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    condition: { type: String, required: true },
    availability: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Book', bookSchema);

