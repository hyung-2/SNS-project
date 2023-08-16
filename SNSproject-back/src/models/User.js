const mongoose = require('mongoose')

const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  repassword: {
    type: String,
    required: true,
  },
  birth: {
    type: Stirng,
    
  }
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    defautl: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User