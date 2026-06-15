require('dotenv').config();
const mongoose = require('mongoose');
const { connectRabbitMQ, consumeOrders } = require('./Utils/rabbitMQ');
const Order = require('./Models/Order');

async function processOrder(order) {
  console.log(`✅ Processing order for user ${order.userId} with total ₹${order.totalPrice}`);

  // Example processing: update status to 'Processed'
  await Order.findByIdAndUpdate(order._id, { status: 'Processed' });

  console.log(`✅ Order ${order._id} processed successfully`);
}

async function startWorker() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected in worker');

    await connectRabbitMQ();

    await consumeOrders(processOrder);
  } catch (err) {
    console.error('🔥 Worker error:', err);
  }
}

startWorker();
