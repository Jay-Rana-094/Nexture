const nodemailer = require('nodemailer');

let transporter = null;

async function initTransport() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    console.log('✅ Nodemailer configured with SMTP host');
  } else {
    // Fall back to ethereal for development/demo if no credentials provided
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('ℹ️  Nodemailer using Ethereal test account (no SMTP creds provided)');
  }

  return transporter;
}

function buildOrderEmail(order) {
  const itemsHtml = (order.items || []).map(i => `<li>${i.name} × ${i.quantity} — $${i.price.toFixed(2)}</li>`).join('');
  const total = order.total || 0;

  const html = `
    <h2>Thank you — your order is confirmed</h2>
    <p>Order ID: <strong>${order.orderId}</strong></p>
    <p>Placed at: ${new Date(order.createdAt).toLocaleString()}</p>
    <h3>Items</h3>
    <ul>${itemsHtml}</ul>
    <p><strong>Total: $${total.toFixed(2)}</strong></p>
    <h3>Shipping</h3>
    <p>${order.shippingAddress && order.shippingAddress.addressLine1 ? order.shippingAddress.addressLine1 : ''}</p>
    <p>Thank you for shopping with Nexture.</p>
  `;

  const text = `Order ${order.orderId}\nTotal: $${total.toFixed(2)}\nThank you for shopping with Nexture.`;

  return { subject: `Order confirmation — ${order.orderId}`, text, html };
}

async function sendOrderConfirmation(order) {
  const transport = await initTransport();
  const { subject, text, html } = buildOrderEmail(order);

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@nexture.app',
    to: order.userEmail,
    subject,
    text,
    html
  };

  const info = await transport.sendMail(mailOptions);
  console.log('✉️  Email sent:', info.messageId);
  const preview = nodemailer.getTestMessageUrl(info);
  if (preview) console.log('Preview URL:', preview);
  return { info, preview };
}

module.exports = {
  initTransport,
  sendOrderConfirmation
};
