const Blog = require('../Models/Blog');

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.json({ message: 'Blog added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
