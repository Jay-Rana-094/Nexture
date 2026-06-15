// server/Utils/email.js

const nodemailer = require('nodemailer');

// Use environment variables for security
const EMAIL_USER = process.env.EMAIL_USER || 'jayrana.work.email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'qvfk unmj gdcg ihes';

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('❌ EMAIL_USER or EMAIL_PASS not set in .env');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Send order confirmation email to the user
 * @param {Object} order
 */
const sendOrderConfirmationEmail = async (order) => {
  try {
    // For demonstration, using a test recipient
    const mailOptions = {
      from: `"Nexture Orders" <${EMAIL_USER}>`,
      to: order.userEmail || EMAIL_USER, // Replace with user's email in production
      subject: `🛒 Order Confirmation - Order #${order._id}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order with ID <strong>${order._id}</strong> has been placed successfully.</p>
        <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
        <p>We will notify you once your order is shipped.</p>
        <br>
        <p>Thank you for shopping with <strong>Nexture</strong>!</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${mailOptions.to}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

module.exports = { sendOrderConfirmationEmail };
