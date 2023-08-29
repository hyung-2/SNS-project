const scroller = new Scroller(false)
const logo = document.querySelector('header .logo')
const myIds = document.querySelectorAll('.myID')
const logoutBtn = document.querySelector('.logoutbtn')
const postBtn = document.querySelector('.postbtn')
const mainCon = document.querySelector('.main')
const mainBox = mainCon.querySelector('.main-content')
const infoBox = document.querySelector('.infobox')
const dropBtn = document.querySelector('.dropdown')
const imoticonBox = document.querySelector('.imoticon-box')
const fixMyInfo = document.querySelector('.re-info')
const imgBoxs = document.querySelectorAll('.imgbox')
const findF = document.querySelector('.find-friend')
const myFollow = document.querySelector('.myfollow')

let imgarr = []
//윈도우 로드시
window.addEventListener('load', function(event){
  console.log(localStorage.getItem('author'))
  //내 정보 조회
  fetch(`http://127.0.0.1:5103/api/users/${localStorage.getItem('author')}`, {
    method: 'GET',
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const friendCount = infoBox.firstElementChild.nextElementSibling.lastElementChild 
      if(friendCount){
        friendCount.innerText = data.user.followUser.length
      }
    })
    .catch(e => console.log(e))



  this.localStorage.removeItem('imgsrc')

  //로고 클릭시 최상단으로
  logo.addEventListener('click', (event) => {
    event.preventDefault()
    this.history.pushState({}, "", `#`)
    scroller.setScrollPosition({top: 0, behavior: 'smooth'})
  })
  //사용자 이름으로 넣기
  myIds.forEach(myid => 
    myid.innerText = `${localStorage.getItem('userId')}`
    )


  //사용자 사진 넣기
  imgBoxs.forEach(imgBox => {
    if(localStorage.getItem('imgUrl') === 'false'){
      imgBox.firstElementChild.src = '../../SNSproject-back/uploads/profile.png'
    }else{
      imgBox.firstElementChild.src = `../../SNSproject-back/${localStorage.getItem('imgUrl')}`
    }
  })
  
  let offset = 0
  let loadNum = 10
  //기존 작성한 게시글 들고오기(최신순)
  this.fetch('http://127.0.0.1:5103/api/posts/new',{
    method: 'GET',
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(datas => {
      console.log(datas)
      
      infoBox.firstElementChild.lastElementChild.innerText = `${postCount(datas)}`
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
          
          if(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight) < 200){
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
                <div class="close">${arr.posts[i]._id}</div>
                <div class="box-profile">
                  <div class="main-profile imgbox">
                    <img src="${isImgUrl(localStorage.getItem('imgUrl'))}" alt="">
                  </div>
                  <div class="link">
                    <span class="heart material-symbols-outlined">favorite</span><span></span>
                  </div>
                </div>
                <div class="content-box">
                  <div class="id-box">
                    <h3 class="myID">${localStorage.getItem('userId')}</h3>
                    <div class="date">${arr.posts[i].createPost}</div>
                    <div class="btn">
                      <button class="repost">수정</button>
                      <button>삭제</button>
                    </div>
                  </div>
                  <div class="main-content" contenteditable="false">
                    ${arr.posts[i].post}
                  </div>
                </div>
              </div>
              <div class="reaple-box">
                <h3 class="myID">${localStorage.getItem('userId')}</h3>
                <div class="reaple-content" contenteditable></div>
                <button class="commentbtn">OK</button>
              </div>
            ` 
  
            mainCon.append(mainBox)

            //좋아요 가져오기
            const heart = mainBox.firstElementChild.firstElementChild.nextElementSibling.lastElementChild.firstElementChild
            if(datas.posts[i].likeUser.includes(localStorage.getItem('author'))){
              // console.log(datas.posts[i].likeUser.length)
              // console.log(heart.nextElementSibling)
              heart.classList.add('fill')
              heart.nextElementSibling.classList.add('bold')
            }
            heart.nextElementSibling.innerText = datas.posts[i].likeUser.length

            // console.log(arr.posts[i]._id)
            //댓글가져오기
            fetch(`http://127.0.0.1:5103/api/comments/${localStorage.getItem('author')}/${arr.posts[i]._id}`, {
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
                    // console.log(c)
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
        }
      }
      
      
    })
    .catch(e => console.log(e))

  mainBox.focus()
  addfiles()
  
  //드롭다운 외부 클릭시 창 닫기
  document.addEventListener('click',function(e){
    // console.log(e.target)
    if(dropBtn && !dropBtn.contains(e.target)){
      imoticonBox.classList.add('close')
    }
  })


  //글쓰기 버튼 클릭
  postBtn.addEventListener('click', function(){
    // console.log(mainCon.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.lastElementChild.innerText)
    let textbox = mainCon.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.lastElementChild
    console.log(textbox.firstElementChild)
    const imgs = textbox.querySelectorAll('img')
    const video = textbox.querySelector('video')
    console.log(textbox)
    // console.log(textbox.querySelectorAll('img').length)
    if(textbox.childElementCount == 1 && textbox.firstElementChild.innerHTML == '<br>' ){
      alert('빈 게시글입니다.')
    }else{
      //쓴글 화면에 추가
      const mainBox = document.createElement('div')
      mainBox.className = 'main-box'
      mainBox.innerHTML += `
        <div class="zeazal-box">
          <div class="box-profile">
            <div class="main-profile imgbox">
              <img src="" alt="">
            </div>
            <div class="link">
              <a href="/">좋아요</a>
              <a href="/">링크따기</a>
            </div>
          </div>
          <div class="content-box">
            <div class="id-box">
              <h3 class="myID">${localStorage.getItem('name')}</h3>
              <div class="date">${dateNow()}</div>
              <div class="btn">
                <button class="repost">수정</button>
                <button>삭제</button>
              </div>
            </div>
            <div class="main-content" contenteditable="false">${textbox.innerHTML}</div>
          </div>
        </div>
        <div class="reaple-box">
          <h3 class="myID">${localStorage.getItem('name')}</h3>
          <div class="reaple-content" contenteditable></div>
          <button>OK</button>
        </div>
      `

      if(textbox.innerHTML.includes('img')){
        //이미지 src 바꾸면서 서버등록
        const formData = new FormData()
      
          console.log(imgs)
          for(let i=0; i < imgs.length; i++){
            console.log(imgs[i].src)
            formData.append('uploadimg',imgarr[i])
            console.log(imgarr[i])
            // console.log(imgFiles.files[0])
          }
          console.log(imgarr)
          console.log(formData)
      
        fetch('http://127.0.0.1:5103/api/posts/img', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            console.log(data.imgurl)
            console.log(data.imgurl.length)
            for(let i=0; i < data.imgurl.length; i++){
              console.log(data.imgurl[i])
              imgs[i].src = `../../SNSproject-back/${data.imgurl[i]}`
              imgs.forEach(img => console.log(img.src))
              }

            fetch('http://127.0.0.1:5103/api/posts/',{
              method: 'POST', 
              headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${localStorage.getItem('token')}`,
                'enctype' : "multipart/form-data"
              },
              body: JSON.stringify({
                post: textbox.innerHTML,
                createPost: `${dateNow()}`
              })
            })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                console.log(data.newPost.post)
              })
              .catch(e => console.log(e))

              textbox.innerText = ''
              textbox.focus()
              addfiles()
              lastCaretLine = textbox.firstChild
          })
          .catch(e => console.log(e))
          location.reload()
      // }else if(textbox.innerHTML.includes('video')){
        //비디오 src 바꾸면서 서버등록 - 갑자기 비디오파일 안올라가서 포기
        //이미지에 쓴거 가져와서 복붙해서 바꾸면됨
      }else{
      //쓴글 서버에 등록(글만 존재) 

      fetch('http://127.0.0.1:5103/api/posts/',{
        method: 'POST', 
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`,
          'enctype' : "multipart/form-data"
        },
        body: JSON.stringify({
          post: textbox.innerHTML,
          createPost: `${dateNow()}`

          // friendUser: req.body.friendUser,
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)})
        .catch(e => console.log(e))

        textbox.innerText = ''
        textbox.focus()
        addfiles()
        lastCaretLine = textbox.firstChild
        location.reload()

      // 시간날때 글자수제한 설정
      
      
      // console.log(addfiles.lastCaretLine)
      }
      mainCon.append(mainBox)
    }
  })

  //게시글 수정.삭제.댓글달기
  mainCon.addEventListener('click', function(e){
    const repostBtn = document.querySelector('.repost')
    const contentBox = e.target.parentElement.parentElement.nextElementSibling
    if(e.target.innerText == '수정'){
      //수정하기
      e.target.innerText = '완료'
      contentBox.contentEditable = 'true'
      contentBox.classList.add('boxline')
    }else if(e.target.innerText == '완료'){
      //수정완료
      const id = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
      e.target.innerText = '수정'
      contentBox.innerHTML = contentBox.innerHTML
      contentBox.contentEditable = 'false'
      contentBox.classList.remove('boxline')
      // console.log(e.target.parentElement.parentElement.nextElementSibling.innerHTML)
      // 시간날때 수정버튼누르고 아무것도 안건드렸을때 수정됨 글씨 안나오게하기
      if(e.target.parentElement.previousElementSibling.innerText.includes('(수정됨)')){
        e.target.parentElement.previousElementSibling.innerText
      }else{
        e.target.parentElement.previousElementSibling.innerText = `${e.target.parentElement.previousElementSibling.innerText} (수정됨)`
      }
      //서버에서 수정
      fetch(`http://127.0.0.1:5103/api/posts/${id}`,{
        method: 'PUT',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          post: e.target.parentElement.parentElement.nextElementSibling.innerHTML,
          createPost: `${e.target.parentElement.previousElementSibling.innerText} `
          // imgurl: imgurl,
          // vedioUrl: videoUrl,
          // files: imgurl,
          // friendUser: req.body.friendUser,
        })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          // data.updatedPost.createPost = `${data.updatedPost.createPost} (수정됨)`
        })
        .catch(e => console.log(e))
    }else if(e.target.innerText == '삭제'){
      //삭제하기
      const id = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
      console.log(e.target.parentElement.parentElement.parentElement.parentElement.parentElement)
      const value = confirm('게시글을 삭제하면 되돌릴수 없습니다.')
      if(value == true){
      mainCon.removeChild(e.target.parentElement.parentElement.parentElement.parentElement.parentElement)
      //서버에서도 삭제
      fetch(`http://127.0.0.1:5103/api/posts/${id}`,{
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(data => {console.log(data)})
        .catch(e => console.log(e))
        location.reload()
      }else{
        return 
      }
    }else if(e.target.innerText == 'OK' && e.target.previousElementSibling.innerText !== ''){
      //댓글달기
      console.log(e.target.parentElement)
      // console.log(e.target.previousElementSibling.innerText)
      // console.log(e.target.parentElement.parentElement.firstElementChild.firstElementChild.innerText)
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
      console.log(e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText)
      const postId = e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.innerText
      const commnetId = e.target.parentElement.parentElement.firstElementChild.innerText
      fetch(`http://127.0.0.1:5103/api/comments/${postId}/${commnetId}`,{
        method: 'DELETE',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(data => {console.log(data)})
      .catch(e => console.log(e))

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
  // console.log(e.target)

  })


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






function nononno(){

}

//다음줄로
function createNewLine(){
  const newline = document.createElement('div')
  newline.innerHTML = `<br/>`
  return newline
}

function addFileToCurrentLine(line, file){
  if(line.nodeType === 3){
    line = line.parentNode
  }
  console.log(line)
  line.insertAdjacentElement('afterend', createNewLine())
  // console.log(line.nextSibling)
  line.nextSibling.insertAdjacentElement('afterbegin', file)
  // console.log(line.nextSibling.insertAdjacentElement('afterbegin', file))
  line.nextSibling.insertAdjacentElement('afterend', createNewLine())
  // console.log(line.nextSibling.nextSibling)
  return line.nextSibling.nextSibling
}


//사진,동영상,이모티콘 추가
function addfiles(){
  mainBox.focus()
  mainBox.insertAdjacentElement("afterbegin", createNewLine())
  let lastCaretLine = mainBox.firstChild
  //위에 두줄은 따로 빼주면 이미지중복이 일어나지 않을것 - 새로고침넣었더니 괜찮아짐,,
  console.log(mainBox)
  const uploadInput = this.document.querySelector('.upload input')
  

  uploadInput.addEventListener('change', function(e){
    e.preventDefault()
    if(mainBox.querySelectorAll('img').length > 1){ //한개씩업로드
      alert('이미지는 최대 2개까지만 첨부할 수 있습니다.')
    }else{
      const files = this.files
      if(files.length > 2){ //한번에 여러개 업로드
        alert('이미지는 최대 2개까지만 첨부할 수 있습니다.')
      }else if(mainBox.querySelectorAll('img').length === 1 && files.length > 1){ //하나 업로드 후 두개 업로드할때
        alert('이미지는 최대 2개까지만 첨부할 수 있습니다.')
      }else if(files.length > 0){
        for(let file of files){
          const fileType = file.type
          imgarr.push(file)
          // console.log(lastCaretLine.nodeType)
          if(fileType.includes('image')){
            const img = document.createElement('img')  
            img.src = URL.createObjectURL(file)
            lastCaretLine = addFileToCurrentLine(lastCaretLine, img)

  
          // }else if(fileType.includes('video')){
          //   const video = document.createElement('video')
          //   video.controls = true
          //   video.src = URL.createObjectURL(file)
          //   lastCaretLine = addFileToCurrentLine(lastCaretLine, video)
          }
        }
        
      }
    }
    // console.log(lastCaretLine)
    //커서 위치를 추가한 파일아래 보이기
    const selection = document.getSelection()
    selection.removeAllRanges()

    const range = document.createRange()
    range.selectNodeContents(lastCaretLine)
    range.collapse()
    selection.addRange(range)
    mainBox.focus()
  
  })
  mainBox.addEventListener('blur', function(e){ //커서 블러처리될때 위치 저장
    lastCaretLine = document.getSelection().anchorNode
    // console.log(lastCaretLine.parentNode, lastCaretLine, lastCaretLine.length)
  })
  //글에 이모티콘 추가
  imoticonBox.addEventListener('click', function(e){
    e.stopPropagation()
    // console.log(e.target)
    if(e.target !== imoticonBox){
      if(mainBox.firstElementChild === lastCaretLine && lastCaretLine.innerHTML === '<br>'){
        lastCaretLine.innerHTML = '' 
        console.log('라스트')
        mainBox.lastElementChild.append(e.target.innerText)
      }else if(mainBox.lastElementChild.innerHTML === '<br>'){
        mainBox.lastElementChild.innerHTML = ''
        mainBox.lastElementChild.append(e.target.innerText) 
      }else{
        mainBox.lastElementChild.append(e.target.innerText) 
      }
    }
  })

}
//드롭다운 열기
dropBtn.addEventListener('click', function(e){
  e.stopPropagation()
  // console.log(e.target)
  if(e.target.innerText == 'sentiment_satisfied'){
    imoticonBox.classList.toggle('close')
  }
})

//내정보 수정
fixMyInfo.addEventListener('click', function(){
  window.location.href = "./userInfo.html"
})

//친구찾기
findF.addEventListener('click', function(){
  window.location.href = './search.html'
})

//팔로잉 목록 보기
myFollow.addEventListener('click', function(){
  localStorage.setItem('follow',localStorage.getItem('author'))
  window.location.href = './follow.html'
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
    return `../../SNSproject-back/${localStorage.getItem('imgUrl')}`
  }
}

//올린 게시글 수 카운트
function postCount(f){
  if(f.code == 404){
    return 0
  }else{
    return f.posts.length
  }
}