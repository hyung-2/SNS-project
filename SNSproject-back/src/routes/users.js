const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { makeToken, isAuth } = require('../../auth')

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
    const { userId, email, isAdmin, createdAt } = loginUser
    res.json({
      code: 200,
      message: '로그인에 성공하였습니다!',
      token: makeToken(loginUser),
      userId, email, isAdmin, createdAt
    })
  }
}))

//로그아웃
router.post('/logout', expressAsyncHandler(async (req, res, next) => {
  console.log(req.body)
  res.json({code: 200, message: '로그아웃하였습니다.'})
}))

// //현재 사용자 조회
// router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next) => {
//   const user = await User.find(req.params.id)
//   if(!user){
//     res.status(404).json({code: 404, message: '사용자를 찾을 수 없습니다.'})
//   }else{
//     res.json({code: 200, user})
//   }
// }))


module.exports = router