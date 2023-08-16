const loginBtn = document.querySelector('.login-btn')
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

//로그인 성공시
loginBtn.addEventListener('click', function(e){
  window.location.href = '../html/main.html'
})


//계정 생성하기 버튼 클릭시(로그인화면에서)
registerBtn.addEventListener('click', function(){
  registerCon.classList.remove('close')
  blurbox.classList.remove('close')
})

console.log(registerCon.children)
console.log(registerCon.children[1].id)

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
  // if()
    fetch('http://127.0.0.1:5002/api/users/register',{
      method: 'POST', 
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        userId: registerCon.userId.value,
        name: registerCon.username.value,
        email: registerCon.useremail.value,
        birth: `${yearOfBirth.options[yearOfBirth.selectedIndex].value}년 ${monthOfBirth.options[monthOfBirth.selectedIndex].value}월 ${dayOfBirth.options[dayOfBirth.selectedIndex].value}일`,
        password: registerCon.userPw.value,
        repassword: registerCon.userPw2.value,
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(e => console.log(e))

      registerCon.classList.add('close')
      blurbox.classList.add('close')
  
})
