const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
require('./passportConfig');
const rabbitMQ = require('./Services/rabbitMQ');
const session = require('express-session');
const app = express();

const productRoutes = require('./Routes/productRoutes');
const authRoutes = require('./Routes/authRoutes');
const blogRoutes = require('./Routes/blogRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const productDetailsRoutes = require('./Routes/productDetailsRoutes');
const emailRoutes = require('./Routes/emailRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/productDetails', productDetailsRoutes);
app.use('/api/emails', emailRoutes);

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    res.redirect(process.env.GOOGLE_OAUTH_SUCCESS_REDIRECT || 'http://localhost:3000/dashboard');
  }
);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Ecommerce';
const RABBIT_URL = process.env.RABBITMQ_URL || 'amqp://localhost';

async function start() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ MongoDB connected');

    // Initialize RabbitMQ for publishers used by routes
    try {
      await rabbitMQ.init(RABBIT_URL);
    } catch (rmqErr) {
      console.error('⚠️ RabbitMQ initialization failed:', rmqErr);
      // continue starting server; publishing will fail until rabbitmq reconnects
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err);
    process.exit(1);
  }
}

start();
