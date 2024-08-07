const mongoose = require('mongoose');
const Order = require('./Order'); // Make sure to import the Order model

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
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // URL or path for the uploaded image
  },
  stock: {
    type: Number,
    default: 0, // Default stock is 0
  },
}, { timestamps: true });

bookSchema.pre('remove', async function(next) {
  console.log('Pre-remove hook triggered for book:', this._id);
  try {
    const result = await Order.deleteMany({ 'books.id': this._id });
    console.log('Orders deleted:', result.deletedCount);
    next();
  } catch (error) {
    next(error);
  }
});
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
