const logoutBtn = document.querySelector('.logoutbtn')
const searchBtn = document.querySelector('.searchbtn')
const resultCon = document.querySelector('.result-container')
const myPageBtn = document.querySelector('.mypage')


//검색버튼 클릭
searchBtn.addEventListener('click', function(e){
  console.log(searchBtn.previousElementSibling.value)
  const id = searchBtn.previousElementSibling.value
  e.stopPropagation()
  fetch(`http://127.0.0.1:5103/api/users/`,{
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      }
  })
    .then(response => response.json())
    .then(datas => {
      resultCon.innerHTML = ''
      console.log(datas)
      console.log(localStorage.getItem('author'))
      if(id === '' || id === null || id === undefined){
        alert('닉네임을 입력하세요')
      }else{
        datas.user.forEach(data => {
          // console.log(data.userId)
          if(id === data.userId){
            console.log(data)
            if(data._id !== localStorage.getItem('author')){ //본인은 검색 안되게끔
              if(data.imgUrl === 'false'){
                //기본 프로필 이미지일때
                createDiv('uploads/profile.png')
              }else{
                createDiv(data.imgUrl)
              }
            }
          }
          //div 만들기 (코드리팩토링)
          function createDiv(url){
            const userBox = document.createElement('div')
            userBox.className = 'userBox'
            userBox.innerHTML = `
              <div class="close">${data._id}</div>
              <div class="imgbox">
                <img src='../../SNSproject-back/${url}'>
              </div>
              <div class="user-info">
                <div>닉네임 : ${data.userId}</div>
                <div>생일 : ${data.birth}</div>
                <div>가입일 : ${data.createdAt.slice(0,10)}</div>
              </div>
            `
            resultCon.append(userBox)
          }
        })
      }
      })
    .catch(e => console.log(e))
})
  
//다른 사용자 메인 가기
resultCon.addEventListener('click', function(e){
  e.stopPropagation()
  const userBoxs = resultCon.querySelectorAll('.userBox')

  if(e.target !== resultCon){
    e.stopPropagation()
    console.log(e.target)
    userBoxs.forEach(userbox => {
      if(userbox.contains(e.target)){
        console.log(userbox.firstElementChild.innerText)
        localStorage.setItem('other', userbox.firstElementChild.innerText)
        
        window.location.href = "./other.html"
      }
    })
  }
})
  
//내 메인페이지로 돌아가기
myPageBtn.addEventListener('click',function(){
  window.location.href = "./main.html"
})
  
  
  
  
  
  
  
  
  
  
  //로그아웃 버튼 클릭
  logoutBtn.addEventListener('click', function() {
    fetch('http://127.0.0.1:5103/api/users/logout',{
        method: 'POST',
      })
        // .then(response => response.json())
        .then(data => {console.log(data)
          window.location.href = "../../index.html"
          window.localStorage.removeItem('author')
          })
        .catch(e => console.log(e))
  })


