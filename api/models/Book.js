const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true, // Ensure ISBN is unique
  },
  image: {
    type: String, // URL or path for the uploaded image
  },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;