ECHO is on.
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const InstagramStrategy = require('passport-instagram').Strategy;
const app = express();

// Database connection
mongoose.connect('mongodb://localhost:27017/instagram-unfollower', { useNewUrlParser: true, useUnifiedTopology: true });

// Passport configuration
passport.use(new InstagramStrategy({
    clientID: 'YOUR_INSTAGRAM_CLIENT_ID',
    clientSecret: 'YOUR_INSTAGRAM_CLIENT_SECRET',
    callbackURL: 'http://localhost:5000/auth/instagram/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // Save user profile and accessToken in the database
    // User.findOrCreate(..., function (err, user) {
    //   return done(err, user);
    // });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Find user by ID and return
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
});

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
