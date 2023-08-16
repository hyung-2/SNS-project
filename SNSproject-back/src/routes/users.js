const express = require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')

const router = express.Router()

//회원가입
router.post('/register', expressAsyncHandler(async (req, res, next) => {
  console.log(req.body)
  const user = new User({
    userId: req.body.userId,
    name: req.body.username,
    email: req.body.useremail,
    password: req.body.userPw,
    repassword: req.body.userPw2,
  })

  const newUser = await user.save()
  if(!newUser){
    res.status(401).json({code: 401, message: '계정 생성에 실패했습니다.'})
  }else{
    const { naem, userId, email, isAdmin, createdAt } = newUser
    res.json({
      code: 200,
      message: '성공적으로 계정을 생성했습니다.',
      token: null, //추후 토큰생성해주기
      naem, userId, email, isAdmin, createdAt
    })
  }
}))


module.exports = router