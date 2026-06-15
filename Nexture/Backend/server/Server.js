const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
require('dotenv').config({ path: __dirname + '/.env' });
connectDB();
const app = express();
const passport = require('passport');
const session = require('express-session');
const apiLimiter = require('./Middleware/rateLimiter');
const orderRoutes = require('./Routes/orderRoutes');
const { connectRabbitMQ } = require('./Utils/rabbitMQ');
connectRabbitMQ();


app.use(cors());
app.use(express.json());

app.use(session({ secret: 'nexturesecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(apiLimiter);

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


app.use('/api/auth', require('./Routes/authRoutes'));
app.use('/api/products', require('./Routes/productRoutes'));
app.use('/api/blogs', require('./Routes/blogRoutes'));
app.use('/api/orders', orderRoutes);

app.use('/graphql', require('./Routes/graphqlRoutes'));

const PORT = process.env.PORT || 6600;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
