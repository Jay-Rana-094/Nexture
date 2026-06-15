// server/Utils/rabbitMQ.js

const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        console.log('✅ RabbitMQ Connected');

        await channel.assertQueue('order_email_queue', { durable: true });
    } catch (err) {
        console.error('❌ RabbitMQ Connection Error:', err);
    }
};

const publishOrder = async (orderData) => {
    if (!channel) {
        console.error('❌ RabbitMQ channel is not initialized.');
        return;
    }
    await channel.sendToQueue('order_email_queue', Buffer.from(JSON.stringify(orderData)), { persistent: true });
    console.log('📨 Order published to queue');
};

const consumeQueue = async (queueName, callback) => {
    if (!channel) {
        console.error('❌ RabbitMQ channel is not initialized.');
        return;
    }
    await channel.consume(queueName, async (msg) => {
        if (msg !== null) {
            const data = JSON.parse(msg.content.toString());
            try {
                await callback(data);
                channel.ack(msg);
                console.log('✅ Message processed and acknowledged');
            } catch (err) {
                console.error('❌ Error processing message:', err);
                // Optionally reject the message without requeue:
                // channel.nack(msg, false, false);
            }
        }
    }, { noAck: false });
};

module.exports = {
    connectRabbitMQ,
    publishOrder,
    consumeQueue
};
