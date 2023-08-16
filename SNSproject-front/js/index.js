const loginBtn = document.querySelector('.login-btn')
const form = document.querySelector('.form')
const Logininputs = form.querySelectorAll('input')
const registerBtn = document.querySelector('.register')
const registerCon = document.querySelector('.register-container')
const registerInputs = registerCon.querySelectorAll('input')
const registerOkBtn = registerCon.querySelector('button')
const blurbox = document.querySelector('.box')
const subBtn = document.querySelector('.submit-btn')


function clickLoginBtn(e){
    window.location.href = '../html/main.html'
}

loginBtn.addEventListener('click', clickLoginBtn)


registerBtn.addEventListener('click', function(){
  registerCon.classList.remove('close')
  blurbox.classList.remove('close')
})

console.log(registerInputs.values)


