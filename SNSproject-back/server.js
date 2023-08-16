const mongoose = require('mongoose')
const express= require('express')
const config = require('./config')
const cors = require('cors')
const app = express()
const logger = require('morgan')

const usersRouter = require('./src/routes/users')

mongoose.connect(config.MONGODB_URL)
  .then(() => console.log('mongodb connected ...'))
  .catch(e => console.log(`failed to connect mongodb- ${e}`))

const corsOptions = {
  origin: 'http://127.0.0.1:5501',
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(logger('tiny'))

app.use(express.urlencoded({extended: true}))
app.use('/api/users', usersRouter)






app.listen(5002, () => {
  console.log('server is running on port 5002 ...')
})

module.exports = usersRouter