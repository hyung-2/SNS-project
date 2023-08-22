const express = require('express')
const Post = require('../models/Post')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')
const multer = require('multer')
const fs = require('fs')

const mongoose = require('mongoose')
const { Types: {ObjectId} } = mongoose

const router = express.Router()

//멀터 설정
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'upload/')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '-' + Date.now())
  }
})

// const upload = multer({ storage : storage })
const upload = multer({ storage : storage})

//테스트
router.post('/test', isAuth, upload.single('upload'), function( req, res, next){
  // let file = req.file

  // let result = {
  //   originalName : file.originalname,
  //   size : file.size
  // }
  console.log(req.file)
  console.log(req.body)
  res.send('uploaded:' + req.file)
  // res.json(file)
})


//post 등록
router.post('/', isAuth, upload.single('upload'), expressAsyncHandler(async (req, res, next) => {
    const post = new Post({
      author: req.user._id,
      post: req.body.post,
      imgurl: req.file,
      vedioUrl: req.body.vedioUrl,
      // files: req.body.files,
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

//post 최신순 조회
router.get('/new', isAuth, expressAsyncHandler(async (req, res, next) => {
  const posts = await Post.aggregate([
    {$match: {author: req.user._id}},
    {$sort:{createdAt: -1}}
  ])
  // console.log(posts)
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

//post 수정
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const post = await Post.findOne({
    author: req.user._id,
    _id: req.params.id
  })
  if(!post){
    res.status(404).json({code: 404, message: '수정할 글이 없습니다.'})
  }else{
    post.post = req.body.post || post.post
    post.imgurl = req.body.imgurl || post.imgurl
    post.vedioUrl = req.body.vedioUrl || post.vedioUrl
    post.createPost = req.body.createPost || post.createPost
    post.lastModifiedAt = new Date()
    
    const updatedPost = await post.save()
    res.json({
      code: 200,
      message: '수정을 완료했습니다.',
      updatedPost
    })

  }
}))



module.exports = router