const loginBtn = document.querySelector('.login-btn')
const closeBtn = document.querySelector('.closebtn')
const form = document.querySelector('.form')
const Logininputs = form.querySelectorAll('input')
const registerBtn = document.querySelector('.register')
const blurbox = document.querySelector('.box')
const registerCon = document.querySelector('.register-container')
const registerInputs = registerCon.querySelectorAll('input')
const subBtn = document.querySelector('.submit-btn')
const birth = document.querySelector('.birth')
const yearOfBirth = document.getElementById('year')
const monthOfBirth = document.getElementById('month')
const dayOfBirth = document.getElementById('day')


//계정 생성하기 버튼 클릭시(로그인화면에서)
registerBtn.addEventListener('click', function(){
  registerCon.classList.remove('close')
  blurbox.classList.remove('close')
})

//계정 생성창 닫기
closeBtn.addEventListener('click', function(){
  registerCon.classList.add('close')
  blurbox.classList.add('close')
})

// 계정생성창 label꾸미기
registerCon.addEventListener('keyup',function(e){
  if(e.target.value !== ''){
    e.target.previousElementSibling.classList.remove('forcusing')
  }else{
    e.target.previousElementSibling.classList.add('forcusing')
  }
})

//계정 생성-서버연결
subBtn.addEventListener('click', function(e){
  e.preventDefault()
  checkUserInfo() 
})

//사용자 정보 검사 - 회원가입용
function checkUserInfo(e){
  let id = document.getElementById('userId')
  let name = document.getElementById('username')
  let email = document.getElementById('useremail')
  let password = document.getElementById('userPw')
  let repassword = document.getElementById('userPw2')
  checking(id,'아이디를 입력해주세요.')
  checking(name,'이름을 입력해주세요.')
  checking(email,'이메일을 입력해주세요.')
  checking(password,'비밀번호를 입력해주세요.')
  checking(repassword,'비밀번호를 다시 입력해주세요.')
  if(password.value !== repassword.value){
    alert('비밀번호가 일치하지 않습니다.')
  }else if(
    yearOfBirth.value === '' || yearOfBirth.value === null || yearOfBirth.value === undefined ||
    monthOfBirth.value === '' || monthOfBirth.value === null || monthOfBirth.value === undefined||
    dayOfBirth.value === '' || dayOfBirth.value === null || dayOfBirth.value === undefined)
    {
    alert('생년월일을 골라주세요')
  }else{ 
    fetch('http://127.0.0.1:5002/api/users/register',{
      method: 'POST', 
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        userId: registerCon.id.value,
        name: registerCon.name.value,
        email: registerCon.email.value,
        birth: `${yearOfBirth.options[yearOfBirth.selectedIndex].value}년 ${monthOfBirth.options[monthOfBirth.selectedIndex].value}월 ${dayOfBirth.options[dayOfBirth.selectedIndex].value}일`,
        password: registerCon.password.value,
        repassword: registerCon.repassword.value,
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(e => console.log(e))

      alert('계정을 생성하였습니다!')

      registerCon.classList.add('close')
      blurbox.classList.add('close')
  }
}


//로그인 
loginBtn.addEventListener('click', function(e){
  checkLoginUserInfo()
  e.preventDefault()
})

function checkLoginUserInfo(){
  const loginUserEmail = document.getElementById('loginuseremail')
  const loginUserPw = document.getElementById('loginuserPw')

  checking(loginUserEmail,'이메일을 입력해주세요')
  checking(loginUserPw,'비밀번호를 입력해주세요')
  console.log(loginUserEmail.value)
  if(loginUserEmail.value !== '' && loginUserPw.value !== ''){
    fetch('http://127.0.0.1:5002/api/users/login',{
      method: 'POST', 
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        email: loginUserEmail.value,
        password: loginUserPw.value,
      })
    })
      .then(response => response.json())
      .then(data => {
        if(data.code == 401){
          alert(`code:${data.code}, ${data.message}`)
        }else if(data.code == 200){
          alert(`code:${data.code}, ${data.message}`)
          window.location.href = "SNSproject-front/html/main.html"
        }
      })
      .catch(e => console.log(e))
  }
}




function checking(name,content){
  if(name.value === '' || name.value === null || name.value === undefined){
    alert(`${content}`)
  }
}