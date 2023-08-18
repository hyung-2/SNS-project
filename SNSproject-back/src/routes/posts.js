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
      createPost: req.body.createPost
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

//post 전체 조회
router.get('/', isAuth, expressAsyncHandler(async (req, res, next) => {
  const posts = await Post.find({ author: req.user._id}).populate('author')
  if(posts.length === 0){
    res.status(404).json({code: 404, message: '작성된 글이 없습니다.'})
  }else{
    res.json({code:200, posts})
  }
}))

//post 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const post = await Post.findOne({
    author: req.user._id,
    _id: req.params.id
  })
  if(!post){
    res.status(404).json({code: 404, message: '삭제할 글이 없습니다.'})
  }else{
    await Post.deleteOne({
      author: req.user._id,
      _id: req.params.id
    })
    res.status(204).json({code: 204, message: '게시글을 삭제하였습니다.'})
  }
}))

module.exports = router