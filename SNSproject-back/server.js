const mongoose = require('mongoose')
const express= require('express')
const config = require('./config')
const cors = require('cors')
const app = express()
const logger = require('morgan')
const multer = require('multer')
const fs = require('fs')

const usersRouter = require('./src/routes/users')
const postsRouter = require('./src/routes/posts')

mongoose.connect(config.MONGODB_URL)
  .then(() => console.log('mongodb connected ...'))
  .catch(e => console.log(`failed to connect mongodb- ${e}`))

const corsOptions = {
  origin: 'http://127.0.0.1:5502',
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(logger('tiny'))

app.use(express.urlencoded({extended: true}))
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)


const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now())
  }
})

const upload = multer({ storage : storage })



app.listen(5002, () => {
  console.log('server is running on port 5002 ...')
})

module.exports = usersRouter