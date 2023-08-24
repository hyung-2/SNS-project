const scroller = new Scroller(false)
const logoutBtn = document.querySelector('.logoutbtn')
const myInfo = document.querySelector('.my-info')
const mainCon = document.querySelector('.main')
const logo =document.querySelector('.logo')
const friend = document.querySelector('.find-friend')
const myPageBtn = document.querySelector('.mypage')









//윈도우 로드시
window.addEventListener('load', function(event){

  // console.log(localStorage.getItem('userId'))
  // console.log(localStorage.getItem('author'))
  //로고 클릭시 최상단으로
  logo.addEventListener('click', (event) => {
    event.preventDefault()
    this.history.pushState({}, "", `#`)
    scroller.setScrollPosition({top: 0, behavior: 'smooth'})
  })


  console.log(localStorage.getItem('other'))
  //특정 사용자의 정보 가져오기
  fetch(`http://127.0.0.1:5103/api/users/${localStorage.getItem('other')}`, {
    method: 'GET',
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(userdata => {
      console.log(userdata)
      myInfo.firstElementChild.innerText = userdata.user.userId
      myInfo.firstElementChild.nextElementSibling.firstElementChild.src = isImgUrl(userdata.user.imgUrl)

      //특정 사용자의 게시글 가져오기
      fetch(`http://127.0.0.1:5103/api/posts/${localStorage.getItem('other')}`,{
          method: 'GET',
          headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => response.json())
          .then(datas => {
            console.log(datas)
            myInfo.lastElementChild.firstElementChild.lastElementChild.innerText = datas.posts.length
            
            // datas.posts.forEach(data => {
            //   console.log(data)


            //   const mainBox = document.createElement('div')
            //   mainBox.className = 'main-box'
            //   mainBox.innerHTML = `
            //     <div class="zeazal-box">
            //       <div class="box-profile">
            //         <div class="main-profile imgbox">
            //           <img src="../../SNSproject-back/${userdata.user.imgUrl}" alt="">
            //         </div>
            //         <div class="link">
            //           <a href="/">좋아요</a>
            //           <a href="/">링크따기</a>
            //         </div>
            //       </div>
            //       <div class="content-box">
            //         <div class="id-box">
            //           <h3 class="myID">${userdata.user.userId}</h3>
            //           <div class="date">${data.createPost}</div>
            //           <div class="btn">
            //             <button class="repost">수정</button>
            //             <button>삭제</button>
            //           </div>
            //         </div>
            //         <div class="main-content" contenteditable="false">
            //           ${data.post}
            //         </div>
            //       </div>
            //     </div>
            //     <div class="reaple-box">
            //       <h3 class="myID">${localStorage.getItem('userId')}</h3>
            //       <div class="reaple-content" contenteditable></div>
            //       <button>OK</button>
            //     </div>
            //   ` 
              
            //   mainCon.append(mainBox)
            // })

            let offset = 0
            let loadNum = 10

            showData(datas)

            function showData(datas){
              if(loadNum > datas.posts.length){
                loadPostList(datas.posts.length,datas)
              }else{
                loadPostList(loadNum,datas)
              }
              // 무한스크롤 
              window.addEventListener('scroll', (event) => {
                const scrollHeight = Math.max(
                  document.body.scrollHeight, document.documentElement.scrollHeight,
                  document.body.offsetHeight, document.documentElement.offsetHeight,
                  document.body.clientHeight, document.documentElement.clientHeight
                );
                
                if(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight) < 100){
                  scroller.isScrollend()
                  .then(data => {
                    console.log('바닥')
                    offset = offset + loadNum
                    loadPostList(loadNum,datas)

                  })
                }
              })
            }
            function loadPostList(loadNum, arr){

                for(let i=offset; i<offset+loadNum; i++){
                  // console.log(datas.posts[i])

                  const mainBox = document.createElement('div')
                  mainBox.className = 'main-box'
                  mainBox.innerHTML = `
                    <div class="zeazal-box">
                      <div class="box-profile">
                        <div class="main-profile imgbox">
                          <img src="../../SNSproject-back/${isImgUrl(userdata.user.imgUrl)}" alt="">
                        </div>
                        <div class="link">
                          <a href="/">좋아요</a>
                          <a href="/">링크따기</a>
                        </div>
                      </div>
                      <div class="content-box">
                        <div class="id-box">
                          <h3 class="myID">${userdata.user.userId}</h3>
                          <div class="date">${arr.posts[i].createPost}</div>
                        </div>
                        <div class="main-content" contenteditable="false">
                          ${arr.posts[i].post}
                        </div>
                      </div>
                    </div>
                    <div class="reaple-box">
                      <h3 class="myID">${localStorage.getItem('userId')}</h3>
                      <div class="reaple-content" contenteditable></div>
                      <button>OK</button>
                    </div>
                  ` 
                
            mainCon.append(mainBox)
        }
            }
          })
          .catch(e => console.log(e))
    })
    .catch(e => console.log(e))
    
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


//친구 맺기
friend.addEventListener('click', function(e){
  if(friend.innerText === '친구 맺기'){
    friend.innerText = '친구 끊기'

    fetch(`http://127.0.0.1:5103/api/users/${localStorage.getItem('author')}`,{
      method: 'PUT',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        followUser: localStorage.getItem('other')
      })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(e => console.log(e))
  }else if(friend.innerText === '친구 끊기'){
    friend.innerText = '친구 맺기'
  }
})

//내 메인페이지로 돌아가기
myPageBtn.addEventListener('click',function(){
  window.location.href = "./main.html"
})













//날짜 포맷
function dateNow(){
  const date = new Date()
  let dateFormat = (`${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`)

  return dateFormat
}



//이미지url검사
function isImgUrl(f){
  if(f === 'false'){
    return '../../SNSproject-back/uploads/profile.png'
  }else{
    return `../../SNSproject-back/${f}`
  }
}

// //올린 게시글 수 카운트
// function postCount(f){
//   if(f.code == 404){
//     return 0
//   }else{
//     return f.posts.length
//   }
// }