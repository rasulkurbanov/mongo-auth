const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT | 5000
// const db = require('./config/keys').mongoURI
const db = "mongodb://localhost:27017/loginpage"
const path = require('path')

app.use(express.urlencoded({ extended: true }))

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Successfully connected to the mongodb database ' + db))
  .catch((err) => console.error(err))  

  
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));


//Importing routes
app.use('/', require('./routes/index'))

app.use('/users', require('./routes/users'))




app.listen(PORT, () => console.log(`Server ready port on ${PORT}`))