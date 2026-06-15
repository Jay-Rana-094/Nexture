const express = require('express');
const router = express.Router();
const { login, registerUser } = require('../Controllers/userController');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../Models/User');


// ⬇️ Setup Passport Strategy inline
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:6600/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });

    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        password: 'google_oauth_dummy'
      });
    }

    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    user.token = token;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// ⬇️ Required session handling
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google login route
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`http://localhost:3000/products?token=${token}`);
  }
);

router.post('/register', registerUser);
router.post('/login', login);

module.exports = router;
