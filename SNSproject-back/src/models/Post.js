const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId }} = Schema

const postSchema = new Schema({
  author: {
    type: ObjectId,
    rquired: true,
    ref: 'User',
  },
  post: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
  createPost:{
    type: String,
    // default: Date.now,
  }
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post