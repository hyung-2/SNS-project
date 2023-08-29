const scroller = new Scroller(false)
const logoutBtn = document.querySelector('.logoutbtn')
const myInfo = document.querySelector('.my-info')
const mainCon = document.querySelector('.main')
const logo =document.querySelector('.logo')
const friend = document.querySelector('.find-friend')
const myPageBtn = document.querySelector('.mypage')
const myFollow = document.querySelector('.myfollow')








//윈도우 로드시
window.addEventListener('load', function(event){
  
  console.log(localStorage.getItem('other'))
  console.log(localStorage.getItem('author'))
  fetch(`http://127.0.0.1:5103/api/users/${localStorage.getItem('author')}`,{
    method: 'GET',
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log(data.user.followUser.indexOf(localStorage.getItem('other')) !== -1)
      if(data.user.followUser.indexOf(localStorage.getItem('other')) !== -1){
      
        friend.innerText = '팔로우 끊기'
      }

      //팔로우 맺기
      friend.addEventListener('click', function(e){
        if(friend.innerText === '팔로우 하기'){
          console.log('머임?')
          fetch(`http://127.0.0.1:5103/api/users/follow/${localStorage.getItem('author')}`,{
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

            friend.innerText = '팔로우 끊기'

        }else if(friend.innerText === '팔로우 끊기'){  

          fetch(`http://127.0.0.1:5103/api/users/unfollow/${localStorage.getItem('author')}`,{
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
            .then(data => {console.log(data)})
            .catch(e => console.log(e))
        
            friend.innerText = '팔로우 하기'
        }
      })





    })
    .catch(e => console.log(e))
  // console.log(localStorage.getItem('userId'))
  // console.log(localStorage.getItem('author'))
  //로고 클릭시 최상단으로
  logo.addEventListener('click', (event) => {
    event.preventDefault()
    this.history.pushState({}, "", `#`)
    scroller.setScrollPosition({top: 0, behavior: 'smooth'})
  })


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
      myInfo.lastElementChild.firstElementChild.nextElementSibling.lastElementChild.innerText = userdata.user.followUser.length

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
            if(datas.code === 404){
              console.log('뿌')
              const noPost = document.createElement('div')
              noPost.className = 'nopost'
              noPost.innerHTML=`작성된 글이 없습니다.`
              mainCon.append(noPost)
            }else{
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
  
                  console.log(datas.posts[i])
                  const mainBox = document.createElement('div')
                  mainBox.className = 'main-box'
                  mainBox.innerHTML = `
                    <div class="zeazal-box">
                      <div class="close">${arr.posts[i]._id}</div>
                      <div class="box-profile">
                        <div class="main-profile imgbox">
                          <img src="${isImgUrl(userdata.user.imgUrl)}{" alt="">
                        </div>
                        <div class="link">
                        <span class="heart material-symbols-outlined">favorite</span><span></span>
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
  
                  //좋아요 가져오기
                  const heart = mainBox.firstElementChild.firstElementChild.nextElementSibling.lastElementChild.firstElementChild
                  if(datas.posts[i].likeUser.includes(localStorage.getItem('author'))){
                    console.log(heart)
                    console.log(datas.posts[i].likeUser.length)
                    console.log(heart.nextElementSibling)
                    heart.classList.add('fill')
                    heart.nextElementSibling.classList.add('bold')
                  }
                  heart.nextElementSibling.innerText = datas.posts[i].likeUser.length
  
  
                  console.log(arr.posts[i]._id)
                  //댓글가져오기
                  fetch(`http://127.0.0.1:5103/api/comments/${localStorage.getItem('other')}/${arr.posts[i]._id}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type':'application/json',
                      'Authorization':`Bearer ${localStorage.getItem('token')}`
                    }
                  })
                    .then(response => response.json())
                    .then(cdata => {
                      console.log(cdata)
                      cdata.comment.forEach(c => {
                        if(c.post === datas.posts[i]._id){
                          console.log(c)
                          const reBox = document.createElement('div')
                          reBox.className = 'reaple-box'
                          reBox.innerHTML = `
                            <div class="close">${c._id}</div>
                            <h3 class="myID">${c.author.userId}</h3>
                            <div class="reaple-content noborder">${c.comment}</div>
                            <button class="delete"><span class="material-symbols-outlined">close</span></button>
                          `
                        
                          mainBox.append(reBox)
                        
                          //다른사용자 댓글 삭제버튼 안보이기
                          if(localStorage.getItem('author') !== c.author._id){
                            reBox.lastElementChild.classList.add('close')
                          }
                        }
                      })
                    })
                    .catch(e => console.log(e))
          
  
  
                  mainCon.append(mainBox)
                }
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
// friend.addEventListener('click', function(e){
//   if(friend.innerText === '친구 맺기'){
//     friend.innerText = '친구 끊기'

//     fetch(`http://127.0.0.1:5103/api/users/${localStorage.getItem('author')}`,{
//       method: 'PUT',
//       headers:{
//         'Content-Type':'application/json',
//         'Authorization':`Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify({
//         followUser: localStorage.getItem('other')
//       })
//     })
//       .then(response => response.json())
//       .then(data => console.log(data))
//       .catch(e => console.log(e))
//   }else if(friend.innerText === '친구 끊기'){
//     friend.innerText = '친구 맺기'
    
//     fetch(`http://127.0.0.1:5103/api/users/${localStorage.getItem('author')}`,{
//       method: 'PUT',
//       headers:{
//         'Content-Type':'application/json',
//         'Authorization':`Bearer ${localStorage.getItem('token')}`
//       },
//       body: JSON.stringify({
//         followUser:
//           followUser.forEach(
//             followU => {
//               followU.indexOf(localStorage.getItem('other')) !== -1 ? null : followU
//             })
//       })
//     })
//       .then(response => response.json())
//       .then(data => console.log(data))
//       .catch(e => console.log(e))

//   }
// })

//내 메인페이지로 돌아가기
myPageBtn.addEventListener('click',function(){
  window.location.href = "./main.html"
})



//해당 사용자의 팔로잉 목록 보기
myFollow.addEventListener('click', function(){
  localStorage.setItem('follow',localStorage.getItem('other'))
  window.location.href = './follow.html'
})

//댓글달기.삭제
mainCon.addEventListener('click',function(e){

  if(e.target.innerText == 'OK' && e.target.previousElementSibling.innerText !== ''){
    //댓글달기
    console.log(e.target.parentElement)
    console.log(e.target.previousElementSibling.innerText)
    console.log(e.target.parentElement.parentElement.firstElementChild.firstElementChild.innerText)
    console.log(localStorage.getItem('author'))
    const reBox = document.createElement('div')
    reBox.className = 'reaple-box'
    reBox.innerHTML = `
      <h3 class="myID">${localStorage.getItem('userId')}</h3>
      <div class="reaple-content noborder">${e.target.previousElementSibling.innerText}</div>
      <button class="delete"><span class="material-symbols-outlined">close</span></button>
    `
    // 댓글 서버 추가
    fetch('http://127.0.0.1:5103/api/comments/',{
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      },
      body:JSON.stringify({
        comment: e.target.previousElementSibling.innerText,
        postid: e.target.parentElement.parentElement.firstElementChild.firstElementChild.innerText
      })

    })
      .then(response => response.json())
      .then(data => {console.log(data)})
      .catch(e => console.log(e))
  


    e.target.parentElement.parentElement.append(reBox)
    e.target.previousElementSibling.innerText =''
  }else if(e.target.innerText == 'OK' && e.target.previousElementSibling.innerText == ''){
    alert('빈 댓글입니다.')  
  }else if(e.target.innerText == 'close'){
    //댓글 삭제하기
    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
  }else if(e.target.innerText == 'favorite'){
    //좋아요 구현
    e.target.classList.toggle('fill')
    const postId = e.target.parentElement.parentElement.parentElement.firstElementChild.innerText
    console.log(postId)
    if(e.target.classList.contains('fill') === true){
      //좋아요
      fetch(`http://127.0.0.1:5103/api/posts/like/${postId}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify({
          likeUser: localStorage.getItem('author')
        })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => console.log(e))

      console.log(Number(e.target.nextElementSibling.innerText))
      e.target.nextElementSibling.innerText = Number(e.target.nextElementSibling.innerText) + 1
    }else{
      //좋아요 취소
      fetch(`http://127.0.0.1:5103/api/posts/unlike/${postId}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify({
          likeUser: localStorage.getItem('author')
        })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(e => console.log(e))

      e.target.nextElementSibling.innerText = Number(e.target.nextElementSibling.innerText) - 1
    }

    
  }




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
