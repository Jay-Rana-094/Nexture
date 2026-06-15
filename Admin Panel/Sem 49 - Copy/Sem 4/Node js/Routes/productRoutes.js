const express = require('express');
const router = express.Router();
const Product = require('../Models/Product');
const ProductDetails = require('../Models/ProductDetails');

// Get all products
router.get("/", async (req, res) => {
  try {
    const fetchedData = await Product.find();
    res.status(200).json(fetchedData);
  } catch (err) {
    res.status(501).json({ message: err });
  }
});

// Get product details by productId
router.get('/product/:productId', async (req, res) => {
  try {
    const details = await ProductDetails.findOne({ productId: req.params.productId });
    if (!details) return res.status(404).json({});
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    console.log("Backend received:", req.body);

    const { name, price, description, image, category } = req.body; // include category & image

    const newProduct = new Product({ name, price, description, image, category });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully!" });
  } catch (err) {
    console.error("Backend error:", err.message);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body; // include category & image
    await Product.findByIdAndUpdate(req.params.id, { name, price, description, image, category });
    res.status(200).json({ message: "Product updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
