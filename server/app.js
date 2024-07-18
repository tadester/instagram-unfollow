
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const InstagramStrategy = require('passport-instagram').Strategy;
const userRoutes = require('./routes/userRoutes');
const User = require('./models/User');
const config = require('config');

const app = express();

mongoose.connect(config.get('mongoURI'), { useNewUrlParser: true, useUnifiedTopology: true });

passport.use(new InstagramStrategy({
  clientID: config.get('instagramClientID'),
  clientSecret: config.get('instagramClientSecret'),
  callbackURL: "http://localhost:5000/auth/instagram/callback"
},
function(accessToken, refreshToken, profile, done) {
  User.findOrCreate({ instagramId: profile.id }, function (err, user) {
    user.accessToken = accessToken;
    user.save();
    return done(err, user);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', userRoutes);

app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
