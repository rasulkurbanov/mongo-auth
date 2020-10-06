const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/User')
const passport = require('passport')


//Login page
router.get('/login', (req, res) => res.render("login"))

//Register page
router.get('/register', (req, res) => res.render("register"))

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body

  const errors = []

  //Error validation in registering
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill all the fields' })
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must contain at least 6 characters' })
  }

  if (errors.length > 0) {
    res.render('register', { errors, name, email, password, password2 })
  }
  else {
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          errors.push({ msg: 'An email is already in use' })
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          })
        }
        else {
          const newUser = new User({
            name,
            email,
            password,
            password2
          })

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw new Error(err)
              else {
                newUser.password = hash
                newUser.save()
                  .then(user => {
                    req.flash('success_msg', 'You are now registered and can log in')
                    res.redirect('/users/login')
                  })
                  .catch(err => console.log(err))
              }
            })
          })


        }
      })
      .catch(err => console.log(err))
  }
})


//Login handler
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'Loggin out, are you sure?')
  res.redirect('/users/login')
})


module.exports = router