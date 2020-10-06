const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const User = require('../models/User')


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
          console.log(newUser)
          res.send('Hlelo')
        }
      })
      .catch(err => console.log(err))
  }
})


module.exports = router