const amqp = require('amqplib');

let connection = null;
let channel = null;
let connectPromise = null;

async function init(rabbitUrl) {
  if (connectPromise) return connectPromise;
  connectPromise = (async () => {
    const url = rabbitUrl || process.env.RABBITMQ_URL || 'amqp://localhost';
    let attempts = 0;
    const maxAttempts = 5;
    const baseDelay = 1000;

    while (attempts < maxAttempts) {
      try {
        connection = await amqp.connect(url);
        connection.on('error', err => {
          console.error('RabbitMQ connection error:', err);
        });
        connection.on('close', () => {
          console.error('RabbitMQ connection closed, attempting reconnect...');
          connection = null;
          channel = null;
          connectPromise = null;
          setTimeout(() => init(url).catch(() => {}), 2000);
        });

        channel = await connection.createConfirmChannel();
        channel.on('error', err => console.error('RabbitMQ channel error:', err));

        console.log('✅ RabbitMQ connected');
        return;
      } catch (err) {
        attempts += 1;
        console.error(`RabbitMQ connect attempt ${attempts} failed:`, err && err.message ? err.message : err);
        await new Promise(r => setTimeout(r, baseDelay * attempts));
      }
    }

    throw new Error('Failed to connect to RabbitMQ after several attempts');
  })();

  // If the init attempt eventually fails, clear connectPromise so future calls can retry
  connectPromise.catch(() => {
    connectPromise = null;
  });

  return connectPromise;
}

async function ensureChannel() {
  if (!channel) {
    await init();
  }
  return channel;
}

async function publishToQueue(queue, payload, options = {}) {
  const ch = await ensureChannel();
  await ch.assertQueue(queue, { durable: true });
  return new Promise((resolve, reject) => {
    const buffer = Buffer.from(JSON.stringify(payload));
    const opts = Object.assign({ persistent: true, headers: options.headers || {} }, options);
    ch.sendToQueue(queue, buffer, opts, (err, ok) => {
      if (err) return reject(err);
      resolve(ok);
    });
  });
}

async function consume(queue, onMessage, consumerOptions = {}) {
  const ch = await ensureChannel();
  await ch.assertQueue(queue, { durable: true });
  ch.consume(queue, msg => {
    if (msg === null) return;
    try {
      onMessage(msg, ch);
    } catch (err) {
      console.error('Error in consumer handler:', err);
      try { ch.nack(msg, false, false); } catch (e) { console.error('Failed to nack message:', e); }
    }
  }, { noAck: false, ...consumerOptions });
}

async function close() {
  try {
    if (channel) await channel.close();
  } catch (e) { console.error('Error closing channel', e); }
  try {
    if (connection) await connection.close();
  } catch (e) { console.error('Error closing connection', e); }
  channel = null;
  connection = null;
  connectPromise = null;
}

module.exports = {
  init,
  publishToQueue,
  consume,
  close
};
