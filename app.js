const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const app = express()
const PORT = process.env.PORT | 5000
// const db = require('./config/keys').mongoURI
const db = "mongodb://localhost:27017/loginpage"
const path = require('path')

//Passport config
require('./config/passport')(passport)



app.use(express.urlencoded({ extended: true }))

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Successfully connected to the mongodb database ' + db))
  .catch((err) => console.error(err))  

  
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

//Express session
app.use(session({
  secret: 'keyboard secret key',
  resave: true,
  saveUninitialized: true,
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



//Importing routes
app.use('/', require('./routes/index'))

app.use('/users', require('./routes/users'))




app.listen(PORT, () => console.log(`Server ready port on ${PORT}`))