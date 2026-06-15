const express = require('express');
const router = express.Router();
const Order = require('../Models/Order');
const rabbitMQ = require('../Services/rabbitMQ');

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { userId, items, totalPrice, shippingAddress, userEmail } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0 || !totalPrice || !shippingAddress || !userEmail) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    const mappedItems = items.map(i => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity
    }));

    const newOrder = new Order({
      user: userId,
      userEmail,
      items: mappedItems,
      shippingAddress,
      total: totalPrice,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    // Prepare payload for email worker
    const payload = {
      orderId: savedOrder._id,
      userId,
      userEmail,
      items: savedOrder.items,
      total: savedOrder.total,
      shippingAddress: savedOrder.shippingAddress,
      createdAt: savedOrder.createdAt
    };

    let published = false;
    try {
      await rabbitMQ.publishToQueue('order_email_queue', payload);
      published = true;
      console.log('Order published to queue:', savedOrder._id);
    } catch (pubErr) {
      console.error('Failed to publish order to queue:', pubErr);
      // do not fail the order creation if publishing fails; worker can be retried later
    }

    res.status(201).json({ order: savedOrder, queuePublished: published });
  } catch (error) {
    console.error('🔥 Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /api/orders - list orders for admin UI
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    // normalize response shape expected by the admin React UI
    const out = orders.map(o => ({
      _id: o._id,
      user: o.user,
      email: o.userEmail || o.email || '',
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items,
      shippingAddress: o.shippingAddress
    }));
    res.json(out);
  } catch (err) {
    console.error('Failed to list orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/user/:userId - list orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    const out = orders.map(o => ({
      _id: o._id,
      user: o.user,
      email: o.userEmail || o.email || '',
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      items: o.items,
      shippingAddress: o.shippingAddress
    }));
    res.json(out);
  } catch (err) {
    console.error('Failed to fetch user orders:', err);
    res.status(500).json({ error: 'Failed to fetch user orders' });
  }
});

module.exports = router;
