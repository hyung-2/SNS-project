const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId }} = Schema

const commentSchema = new Schema({
  author: {
    type: ObjectId,
    rquired: true,
    ref: 'User',
  },
  post: {
    type: ObjectId,
    rquired: true,
    ref: 'Post',
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  }
})

const comment = mongoose.model('comment', commentSchema)

module.exports = comment