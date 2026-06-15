const express = require('express');
const router = express.Router();
const Blog = require('../Models/Blog');

router.post('/', async (req, res) => {
  try {
    const { title, summary, content, image } = req.body;

    console.log('📥 Incoming Blog:', req.body);

    if (!title || !summary || !content || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newBlog = new Blog({ title, summary, content, image });
    await newBlog.save();

    res.status(201).json({ message: '✅ Blog created successfully!' });
  } catch (err) {
    console.error('🔥 Error while saving blog:', err.message);
    res.status(500).json({ error: '❌ Failed to create blog', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch blog', detail: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, summary, content, image} = req.body;
    await Blog.findByIdAndUpdate(req.params.id, {title, summary, content, image});
    res.status(200).json({ message: "Blog updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update Blog" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully!' });
  } catch (err) {
    console.error('🔥 Error deleting blog:', err.message);
    res.status(500).json({ error: '❌ Failed to delete blog', detail: err.message });
  }
});

module.exports = router;
