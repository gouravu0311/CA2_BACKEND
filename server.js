const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const MONGO_URI = 'mongodb+srv://gouravu0311_db_user:ujd4ux26cri2K2wh@cluster0.vyywpap.mongodb.net/library';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Connection error:', err.message));

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, trim: true },
  category: { type: String, trim: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
const Book = mongoose.model('Book', bookSchema);

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, category } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const book = await Book.create({ title, author, category });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
app.get('/api/books', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({ message: 'page and limit must be positive numbers' });
    }

    const skip = (page - 1) * limit;
    const totalRecords = await Book.countDocuments();
    const books = await Book.find().skip(skip).limit(limit);

    res.status(200).json({
      currentPage: page,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      books
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));