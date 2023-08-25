const express = require('express')
const Comment = require('../models/Comment')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const mongoose = require('mongoose')
const { Types: {ObjectId} } = mongoose

const router = express.Router()

//특정 댓글 조회
router.get('/:user/:id', expressAsyncHandler(async (req, res, next) => {
  const comment = await Comment.find({
    // author: req.params.user,
    post: req.params.id
  }).populate('author')
  if(comment.length === 0){
    res.status(404).json({code: 404, message: '댓글이 없습니다.'})
  }else{
    res.json({code: 200, comment})
  }
}))

//댓글 등록
router.post('/', isAuth, expressAsyncHandler(async (req, res, next) =>{
  const comment = new Comment({
    author: req.user._id,
    post: new ObjectId(req.body.postid),
    comment: req.body.comment,
  })
  const newComment = await comment.save()
  if(!newComment){
    res.status(401).json({code: 401, message: '댓글 등록에 실패했습니다.'})
  }else{
    res.status(201).json({
      code: 201,
      message: '새로운 댓글이 등록되었습니다.',
      newComment
    })
  }
}))

//댓글삭제
router.delete('/:post/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const comment = await Comment.findOne({
    author: req.user._id,
    post: req.params.post,
    _id: req.params.id
  })
  if(!comment){
    res.status(404).json({code: 404, message: '삭제할 댓글이 없습니다.'})
  }else{
    await Comment.deleteOne({
      author: req.user._id,
      _id: req.params.id
    })
    res.status(204).json({code: 204, message: '댓글을 삭제하였습니다.'})
  }
}))


module.exports = router