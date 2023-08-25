const express = require('express')
const Post = require('../models/Post')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const mongoose = require('mongoose')
const { Types: {ObjectId} } = mongoose

const router = express.Router()

//멀터 설정
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'postimgs/')
  },
  //destination을 제거해보라는 스택오버플로우답변이있었음 - c드라이브 로컬에 저장되지만 새로고침은 안됨
  filename: function(req, file, cb){
    cb(null, file.fieldname + '_posts_' + Date.now().valueOf() + path.extname(file.originalname))
  }
})

let upload = multer({ storage : storage})

//이미지 multer(단일)
router.post('/img', upload.single('uploadimg'), function( req, res){
  res.send({
    'uploaded:' : req.file,
    imgurl: req.file.path
  })
  console.log(req.file)
})

//비디오 multer(단일)
router.post('/video', upload.single('uploadvideo'), function(req, res){
  res.send({
    'uploaded:' : req.file,
    videourl: req.file.path
  })
  console.log(req.file)
})


//post 등록
router.post('/', isAuth, expressAsyncHandler(async (req, res, next) => {
    const post = new Post({
      author: req.user._id,
      post: req.body.post,
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
    {$match: {author: new ObjectId(req.user._id)}},
    {$sort:{createdAt: -1}}
  ])
  // console.log(posts)
  if(posts.length === 0){
    res.status(404).json({code: 404, message: '작성된 글이 없습니다.'})
  }else{
    res.json({code:200, posts})
  }
}))

//다른사용자 post 최신순 조회
router.get('/:id', expressAsyncHandler(async (req, res, next) => {
  const posts = await Post.aggregate([
    {$match: {author: new ObjectId(req.params.id)}},
    {$sort:{createdAt: -1}}
  ])
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

//좋아요누르기
router.put('/like/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const post = await Post.updateOne(
    {_id: req.params.id},
    {$push: {likeUser: req.body.likeUser}}
  )
  if(!post){
    res.status(404).json({code: 404, message: 'Post를 찾을 수 없습니다.'})
  }else{
    console.log(req.body)
    res.json({
      code: 200,
      message: '좋아요 버튼 꾹',
      post
    })
  }
}))

//좋아요 취소
router.put('/unlike/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
  const post = await Post.updateOne(
    {_id: req.params.id},
    {$pull: {likeUser: req.body.likeUser}}
  )
  if(!post){
    res.status(404).json({code: 404, message: 'Post를 찾을 수 없습니다.'})
  }else{
    console.log(req.body)
    res.json({
      code:200,
      message: '좋아요 버튼 취소',
      post
    })
  }
}))


module.exports = router