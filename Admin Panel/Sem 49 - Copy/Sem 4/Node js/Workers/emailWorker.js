require('dotenv').config();
const rabbitMQ = require('../Services/rabbitMQ');
const emailService = require('../Services/email');
const mongoose = require('mongoose');
const FailedEmail = require('../Models/FailedEmail');

const QUEUE_NAME = process.env.ORDER_EMAIL_QUEUE || 'order_email_queue';
const RABBIT_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Ecommerce';
const MAX_RETRIES = parseInt(process.env.EMAIL_MAX_RETRIES || '3', 10);

async function start() {
  try {
    // connect to MongoDB so we can persist failed email records
    try {
      await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('✅ Worker connected to MongoDB');
    } catch (dbErr) {
      console.error('Worker failed to connect to MongoDB:', dbErr);
      // continue; we still want to connect to RabbitMQ and attempt processing
    }

    await rabbitMQ.init(RABBIT_URL);
    console.log('Email worker connected to RabbitMQ, consuming queue:', QUEUE_NAME);

    await rabbitMQ.consume(QUEUE_NAME, async (msg, channel) => {
      const headers = (msg.properties && msg.properties.headers) || {};
      const attempts = headers['x-attempts'] ? parseInt(headers['x-attempts'], 10) : 0;

      let payload = null;
      try {
        payload = JSON.parse(msg.content.toString());
      } catch (err) {
        console.error('Invalid message payload, acking to remove from queue:', err);
        channel.ack(msg);
        return;
      }

      try {
        await emailService.sendOrderConfirmation(payload);
        console.log('Email sent for order:', payload.orderId);
        channel.ack(msg);
      } catch (err) {
        console.error(`Failed to send email for order ${payload && payload.orderId}:`, err && err.message ? err.message : err);
        if (attempts < MAX_RETRIES) {
          const nextAttempts = attempts + 1;
          const delayMs = 1000 * Math.pow(2, attempts); // exponential backoff
          console.log(`Retrying (${nextAttempts}/${MAX_RETRIES}) after ${delayMs}ms`);

          // requeue the message with incremented attempt header after a delay
          setTimeout(async () => {
            try {
              await rabbitMQ.publishToQueue(QUEUE_NAME, payload, { headers: { 'x-attempts': nextAttempts } });
              console.log('Message requeued for retry', payload.orderId);
            } catch (pubErr) {
              console.error('Failed to requeue message:', pubErr);
            }
          }, delayMs);

          // ack original to avoid duplicate immediate deliveries
          channel.ack(msg);
        } else {
          console.error('Max retries reached for order:', payload.orderId, 'Persisting failed email record');
          try {
            await FailedEmail.create({
              orderId: payload.orderId,
              payload,
              attempts: attempts,
              lastError: err && err.message ? err.message : String(err),
              status: 'failed'
            });
            console.log('Saved failed email record for order:', payload.orderId);
          } catch (saveErr) {
            console.error('Failed to persist failed email record:', saveErr);
          }
          channel.ack(msg);
        }
      }
    });
  } catch (err) {
    console.error('Email worker startup failed:', err);
    process.exit(1);
  }
}

start();

// graceful shutdown
process.on('SIGINT', async () => {
  console.log('Email worker shutting down...');
  try { await rabbitMQ.close(); } catch (e) { console.error(e); }
  try { await mongoose.disconnect(); } catch (e) { }
  process.exit(0);
});
