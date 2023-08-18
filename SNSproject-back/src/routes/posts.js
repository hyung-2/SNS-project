const express = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const mongoose = require('mongoose')
const { Types: {ObjectId} } = mongoose

const router = express.Router()

//post 등록
router.post('/', isAuth, expressAsyncHandler(async (req, res, next) => {
    const post = new Post({
      author: req.user._id,
      post: req.body.post,
      imgurl: req.body.imgurl,
      vedioUrl: req.body.vedioUrl,
      friendUser: req.body.friendUser,
    })
    const newPost = await post.save()
    if(!newPost){
      res.status(401).json({code: 401, message: '글 등록에 실패했습니다.'})
    }else{
      res.status(201).json({
        code: 201,
        message: '새로운 글이 등록되었습니다.',
        newPost
      })
    }
  
}))

module.exports = router