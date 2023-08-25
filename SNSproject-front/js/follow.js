const scroller = new Scroller(false)
const resultCon = document.querySelector('.result-container')
const myPageBtn = document.querySelector('.mypage')
const logo = document.querySelector('.logo')

window.addEventListener('load', function(){
  console.log(localStorage.getItem('author'))
  console.log(localStorage.getItem('follow'))
  if(localStorage.getItem('author') === localStorage.getItem('follow')){
    //내 팔로잉 목록
    fetching(localStorage.getItem('author'))
  }else{
    //다른 사용자 팔로잉 목록
    fetching(localStorage.getItem('follow'))
      }

  //로고 클릭시 최상단으로
  logo.addEventListener('click', (event) => {
    event.preventDefault()
    this.history.pushState({}, "", `#`)
    scroller.setScrollPosition({top: 0, behavior: 'smooth'})
  })

})


//내 메인페이지로 돌아가기
myPageBtn.addEventListener('click',function(){
  window.location.href = "./main.html"
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
        if(userbox.firstElementChild.innerText === localStorage.getItem('author')){
          //다른 사용자 팔로잉에 내가 있을때
          window.location.href = "./main.html"
        }else{
          window.location.href = "./other.html"
        }
      }
    })
  }
})

//코드리팩토링-패치
function fetching(f){
  fetch(`http://127.0.0.1:5103/api/users/${f}`,{
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if(data.user.followUser.length === 0){
          const userBox = document.createElement('div')
                  userBox.className = 'userBox'
                  userBox.innerHTML = `팔로우중인 사용자가 없습니다.`
          resultCon.append(userBox)
        }else{
          data.user.followUser.forEach(user => {
            console.log(user)
            // console.log(user !== localStorage.getItem('author'))
            fetch(`http://127.0.0.1:5103/api/users/${user}`,{
              method: 'GET',
              headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem('token')}`
              }
            })
              .then(response => response.json())
              .then(data => {
                console.log(data)
    
    
                if(data.user.imgUrl === 'false'){
                  //기본 프로필 이미지일때
                  createDiv('uploads/profile.png')
                }else{
                  createDiv(data.user.imgUrl)
                }
                
                
                function createDiv(url){
                  const userBox = document.createElement('div')
                  userBox.className = 'userBox'
                  userBox.innerHTML = `
                    <div class="close">${data.user._id}</div>
                    <div class="imgbox">
                      <img src='../../SNSproject-back/${url}'>
                    </div>
                    <div class="user-info">
                      <div>닉네임 : ${data.user.userId}</div>
                      <div>생일 : ${data.user.birth}</div>
                      <div>가입일 : ${data.user.createdAt.slice(0,10)}</div>
                    </div>
                  `
                  resultCon.append(userBox)
  
                  if(data.user._id === localStorage.getItem('author')){
                    userBox.lastElementChild.firstElementChild.innerText = `닉네임 : ${data.user.userId} (나)`
  
                  }
                }
              })
              .catch(e => console.log(e))
          })
        }
        })
}