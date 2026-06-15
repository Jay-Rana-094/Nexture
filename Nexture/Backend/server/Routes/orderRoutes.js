const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const { publishOrder } = require('../Utils/rabbitMQ');

router.post('/', async (req, res) => {
  try {
    const { userId, items, totalPrice, shippingAddress, userEmail  } = req.body;
    if (!userId || !items || !totalPrice || !shippingAddress) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      shippingAddress,
      userEmail, // Ensure userEmail is included
      status: 'Pending',
    });

    const savedOrder = await newOrder.save();

    // ✅ Pass full order with userEmail to RabbitMQ
    await publishOrder(savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('🔥 Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
