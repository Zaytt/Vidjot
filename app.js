const express         = require('express');
const mongoose        = require('mongoose');
const exphbs          = require('express-handlebars');
const bodyParser      = require('body-parser');
const methodOverride  = require('method-override')
const flash           = require('connect-flash');
const session         = require('express-session');
const path            = require('path');
const passport        = require('passport');


const app = express();

// ---------------------------- LOAD ROUTES  ----------------------------

const ideasRouter = require('./routes/ideas');
const usersRouter = require('./routes/users');

// ---------------------------- PASSPORT CONFIG  ----------------------------

require('./config/passport')(passport);

// ---------------------------- DATABASE  ----------------------------
 
const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.promise = global.promise; 
// Connect to mongoose
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true
})
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch(err => console.log(err));



// ---------------------------- MIDDLEWARES  ----------------------------
 


// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parse Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));
// Method-Override Middleware
app.use(methodOverride('_method'));

// Connect Flash Middleware
app.use(flash());

// Express Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


// ---------------------------- HOME ROUTES  ----------------------------

// Index Route
app.get('/', (req, res) => {
  const title ="Welcome"
  res.render("index", {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});


// ---------------------------- USE ROUTES  ----------------------------

 app.use('/ideas', ideasRouter);
 app.use('/users', usersRouter);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});