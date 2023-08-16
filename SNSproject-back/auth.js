const config = require('./config')
const jwt = require('jsonwebtoken')

//토큰 생성
const makeToken = (user) => {
  return jwt.sign({
    _id: user._id,
    userId: user.userId,
    name: user.name,
    email: user.email,
    birth: user.birth,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt
  },
  config.JWT_SECRET,
  {
    expiresIn: '7d',
    issuer: 'hyung'
  })
}

//사용자 권한 검증
const isAuth = (req, res, next) => {
  const bearToken = req.headers.authorization
  if(!bearToken){
    res.status(401).json({code: 401, message: "토큰이 유효하지 않습니다."})
  }else{
    const token = bearToken.slice(7, bearToken.length)

    jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
      if(err && err.name === 'TokenExpiredError'){
        res.status(419).json({code: 419, message: '토큰이 만료되었습니다.'})
      }else if(err){
        res.status(401).json({code: 401, message: '토큰 확인중에 문제가 생겼습니다.'})
      }else{
        req.user = userInfo
        next()
      }
    })
  }
}


//관리자 권한 검증
const isAdmin = (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next()
  }else{
    res.status(401).json({code: 401, message: '당신은 관리자가 아닙니다.'})
  }
}

module.exports = {
  makeToken,
  isAuth,
  isAdmin,
}