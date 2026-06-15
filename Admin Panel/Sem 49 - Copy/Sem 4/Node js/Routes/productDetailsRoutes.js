const express = require('express');
const router = express.Router();
const ProductDetails = require('../Models/ProductDetails');

router.post('/', async (req, res) => {
  try {
    const {
      productId,
      price,
      category,
      brand,
      specifications,
      detailedDescription,
      features,
      warranty,
      stock,
      rating,
      reviews
    } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const existing = await ProductDetails.findOne({ productId });

    if (existing) {
      await ProductDetails.findOneAndUpdate(
        { productId },
        {
          price,
          category,
          brand,
          specifications,
          detailedDescription,
          features,
          warranty,
          stock,
          rating,
          reviews
        }
      );
      return res.status(200).json({ message: '✅ Product details updated successfully' });
    }

    const newDetail = new ProductDetails({
      productId,
      price,
      category,
      brand,
      specifications,
      detailedDescription,
      features,
      warranty,
      stock,
      rating,
      reviews
    });

    await newDetail.save();
    res.status(201).json({ message: '✅ Product details added successfully' });

  } catch (err) {
    console.error('❌ Failed to save product detail:', err.message);
    res.status(500).json({ error: '❌ Server error', detail: err.message });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const details = await ProductDetails.findOne({ productId: req.params.productId }).populate('productId');
    if (!details) return res.status(404).json({ error: 'No details found' });
    res.status(200).json(details);
  } catch (err) {
    console.error('Failed to get product details:', err);
    res.status(500).json({ error: 'Failed to get product details' });
  }
});

router.put('/:productId', async (req, res) => {
  try {
    await ProductDetails.findOneAndUpdate({ productId: req.params.productId }, req.body);
    res.status(200).json({ message: 'Product details updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product details' });
  }
});

router.get('/productDetails/:productId', async (req, res) => {
  const details = await ProductDetail.findOne({ productId: req.params.productId });
  if (!details) return res.status(404).json({ message: 'No details found' });
  res.json(details);
});

module.exports = router;
