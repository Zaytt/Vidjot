const express   = require('express');
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const passport  = require('passport');
const {ensureAuthenticated} = require('../helpers/auth');

const router = express.Router();

// Load user model
require('../models/User');
const User = mongoose.model('users');

//User login route
router.get('/login', (req, res)=>{
  res.render('users/login');
})

//User register route
router.get('/register', (req, res)=>{
  res.render('users/register');
})

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
})

// Register Form POST
router.post('/register', (req, res) => {
  // Check for errors in the registration form
  let errors = [];
  if(req.body.password != req.body.password2){
    errors.push({text: 'Passwords do not match'});
  }

  if(req.body.password.length < 6){
    errors.push({text: 'Password must be at least 6 characters'});
  }

  // If errors found
  if(errors.length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2

    })
  } else {
    // Check is email already in use
    User.findOne({email: req.body.email})
      .then( user => {
        if(user){
          req.flash('error_msg', 'Email already in use.');
          res.redirect('/users/register');
        } else {
          //No errors, create new user
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });

          // Encrypt password procedure
          // Generate a salt
          bcrypt.genSalt(10, (err, salt) => {
            // Use that salt to hash the user password
            bcrypt.hash(newUser.password, salt, (err, hashedPassword) => {
              if(err) throw error;
              newUser.password = hashedPassword;

              //save user to db
              newUser.save()
                .then(user => {
                  req.flash('success_msg', "You're now registered and can log in");
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(error);
                  return;
                });
            });
          }); 
        }
      }); 
  }
});

// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', "You are logged out");
  res.redirect('/users/login');
});

module.exports = router;