// server/Worker/emailWorker.js

const { connectRabbitMQ, consumeQueue } = require('../Utils/rabbitMQ');
const { sendOrderConfirmationEmail } = require('../Utils/email');

const startEmailService = async () => {
    try {
        await connectRabbitMQ();

        await consumeQueue('order_email_queue', async (orderData) => {
            console.log('📩 Received order for email sending:', orderData);

            // Call directly with the entire order object
            await sendOrderConfirmationEmail(orderData);
        });

        console.log('📩 Email worker ready and listening for messages...');
    } catch (err) {
        console.error('🔥 Email worker error:', err);
    }
};

startEmailService();
