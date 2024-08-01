const express = require('express');
const Book = require('../models/Book'); // Import Book model
const { authenticate } = require('../middlewares/authentication')
const multer = require('multer'); // Import multer for file handling
const path = require('path');

const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next(); // Allow admin user to proceed
    }
    return res.status(403).json({ message: 'Access denied. Admins only.' });
};

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'assets/uploads/'); // Directory to store uploaded images
    },
    filename: (req, file, cb) => {
        //cb(null, `${Date.now()}-${file.originalname}`); // Set a unique filename
        cb(null, `${file.originalname}`); // Set a unique filename
    }
});

const upload = multer({ storage }); // Create multer instance

// Create a new book
router.post('/', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  const { title, isbn, stock } = req.body;
  const imagePath = req.file.path; // Get the image path from uploaded file
  try {
    // Create a new book entry
    const newBook = new Book({ title, isbn, stock, image: imagePath }); // Save the path of the uploaded image
    await newBook.save();

    res.status(201).json(newBook); // Respond with the created book
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all books
router.get('/', authenticate, async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.json(books); // Return the list of books
  } catch (error) {
    console.error('Error retrieving books:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params; // Extract the book ID from request parameters

  try {
    const book = await Book.findById(id); // Fetch the book by ID
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book); // Return the found book
  } catch (error) {
    console.error('Error retrieving the book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a book by ID
router.put('/:id', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  const { id } = req.params; // Get book ID from URL
  const { title, isbn, stock } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, isbn, stock, image: req.file ? req.file.path : undefined }, // Update the book; if there's no new image, keep the old one
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json(updatedBook); // Return the updated book
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a book by ID
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  const { id } = req.params; // Get book ID from URL

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.json({ message: 'Book deleted successfully.' }); // Confirmation message
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
