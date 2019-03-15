const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User Model
const User = mongoose.model('users');

// Create the local strategy
const myLocalStrat = new LocalStrategy(
  {usernameField: 'email'}, 
  (email, password, done) => {
    // Match User
    User.findOne(
      {email: email}
    )
    .then(user => {
      if (!user) {
        return done(null, false, {message: "Could not find a user with that email"});
      }

      // Match Password
      bcrypt.compare(password, user.password, (err, isMatch)=>{
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Password did not match the user, forgot your password?'});
        }
      })
    })
  }
);

module.exports = function(passport){
  passport.use(myLocalStrat);

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}