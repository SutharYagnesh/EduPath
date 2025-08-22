const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const initializeGoogleStrategy = (passport, clientID, clientSecret) => {
  passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "/auth/google/callback"
  },
async (accessToken, refreshToken, profile, done) => {
  // Find or create user
  let user = await User.findOne({ email: profile.emails[0].value });
  if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8); // Generate a random 8-character string
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: hashedPassword
    });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Start Google OAuth
router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Issue JWT and redirect to frontend with token
  const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  // Redirect to frontend with token in query string
  res.redirect(`http://localhost:5173/`);
});

  return router;
};

module.exports = {
  router,
  initializeGoogleStrategy
};