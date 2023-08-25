const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { makeToken, isAuth } = require('../../auth')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const mongoose = require('mongoose')
const { Types: {ObjectId} } = mongoose

const router = express.Router()

//회원가입
router.post('/register', expressAsyncHandler(async (req, res, next) => {
  console.log(req.body)
  const user = new User({
    userId: req.body.userId,
    email: req.body.email,
    birth: req.body.birth,
    password: req.body.password,
  })

  const newUser = await user.save()
  if(!newUser){
    res.status(401).json({code: 401, message: '계정 생성에 실패했습니다.'})
  }else{
    const { userId, email, isAdmin, createdAt } = newUser
    res.json({
      code: 200,
      message: '성공적으로 계정을 생성했습니다.',
      token: makeToken(newUser), //추후 토큰생성해주기
      userId, email, isAdmin, createdAt
    })
  }
}))

//로그인
router.post('/login', expressAsyncHandler(async (req, res, next) => {
  console.log(req.body)
  const loginUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  })
  if(!loginUser){
    res.status(401).json({code: 401, message: 'email이나 비밀번호를 확인해주세요.'})
  }else{
    const { userId, email, isAdmin, createdAt, _id, imgUrl, followUser } = loginUser
    res.json({
      code: 200,
      message: '로그인에 성공하였습니다!',
      token: makeToken(loginUser),
      userId, email, isAdmin, createdAt, _id, imgUrl, followUser
    })
  }
}))

//로그아웃
router.post('/logout', expressAsyncHandler(async (req, res, next) => {
  console.log(req.body)
  res.json({code: 200, message: '로그아웃하였습니다.'})
}))

//현재 사용자 조회
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const user = await User.findOne({_id: req.params.id})
  if(!user){
    res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
  }else{
    res.json({code: 200, user})
  }
}))

//내 정보 수정
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if(!user){
    res.status(404).json({code: 404, message: '사용자를 찾지 못했습니다.'})
  }else{
    console.log(req.body)
    user.userId = req.body.userId || user.userId
    user.password = req.body.password || user.password
    user.isAdmin = req.body.isAdmin || user.isAdmin
    user.imgUrl = req.body.imgUrl || user.imgUrl
    user.lastModifiedAt = new Date()
  }

  const updateUser = await user.save()
  const { userId, birth, isAdmin, imgUrl, followUser } = updateUser
  res.json({
    code: 200,
    message: '사용자 정보 변경에 성공하였습니다.',
    token: makeToken(updateUser),
    userId, birth, isAdmin, imgUrl, followUser
  })
}))

//유저 팔로우
router.put('/follow/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
  const user = await User.updateOne(
    {_id: req.params.id},
    {$push: {followUser: req.body.followUser}}
  )
  if(!user){
    res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
  }else{
    console.log(req.body)
    res.json({
      code:200,
      message: 'follow 성공',
      user
    })
  }
}))

//팔로우 끊기
router.put('/unfollow/:id', isAuth, expressAsyncHandler(async(req, res, next) => {
  const user = await User.updateOne(
    {_id: req.params.id},
    {$pull: {followUser: req.body.followUser}}
  )
  if(!user){
    res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
  }else{
    console.log(req.body)
    res.json({
      code:200,
      message: 'unfollow 성공',
      user
    })
  }
}))

//탈퇴한 사용자 팔로우목록에서 삭제
router.put('/nouser/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const user = await User.updateMany(
    {},
    {$pull: {followUser: req.params.id}}
  )
  if(!user){
    res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
  }else{
    console.log(req.body)
    res.json({
      code:200,
      message: '탈퇴한 유저 삭제 성공',
      user
    })
  }
}))

//전체 사용자 이메일 조회
router.get('/', isAuth, expressAsyncHandler(async (req, res, next) => {
  const user = await User.find({})
  if(user.length === 0){
    res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
  }else{
    res.json({code: 200, user})
  }
}))

//특정 사용자 검색
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const user = await User.find({userId: req.params._id})
  if(!user){
    res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
  }else{
    res.json({code: 200, user})
  }
}))

//사용자프로필 사진 저장
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    cb(null, file.fieldname + '_profile_' + Date.now().valueOf() + path.extname(file.originalname))
  }
})

let upload = multer({ storage : storage })

router.post('/profile', upload.single('userimg'), function(req, res){
  res.send({
    '업로드성공!': req.file,
    imgUrl: req.file.path
  })
  console.log(req.file)
})


//사용자 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if(!user){
    res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
  }else{
    res.status(204).json({code: 204, message: '사용자 정보를 삭제하였습니다.'})
  }
}))



module.exports = router