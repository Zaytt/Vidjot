const express = require('express');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

const router = express.Router();

// Load idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');

// Ideas Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  
  Idea.find({
    user: req.user.id
  })
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    })
});

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});


// GET Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id : req.params.id
  }).then( idea => {
    if(idea.user === req.user.id){
      res.render('ideas/edit', {
        idea: idea
      });
    } else {
      req.flash('error_msg', 'Not authorized');
      res.redirect('/ideas');
    }
    
  });
  
});


// Process Add Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  // SERVER SIDE VALIDATION
  if(!req.body.title){
    errors.push( { text: 'Please add a title' });
  }
  if(!req.body.details){
    errors.push( { text: 'Please add some details' });
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    // VALIDATED -> SAVE NEW USER
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Video Idea Added');
        res.redirect('/ideas');
      });
  }

});


// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  }).then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then( idea => {
        req.flash('success_msg', 'Video Idea Updated');
        res.redirect("/ideas");
      })
  });
})


router.delete('/:id', ensureAuthenticated,(req, res) => {
  Idea.deleteOne({_id: req.params.id})
    .then(()=>{
      req.flash('success_msg', 'Video Idea Removed');
      res.redirect('/ideas');
    });
});

module.exports = router;