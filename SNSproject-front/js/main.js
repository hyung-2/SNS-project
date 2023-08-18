const myIds = document.querySelectorAll('.myID')
const logoutBtn = document.querySelector('.logoutbtn')
const postBtn = document.querySelector('.postbtn')
const mainCon = document.querySelector('.main')
const copyCon = document.querySelector('.copy')
const mainBox = mainCon.querySelector('.main-content')
const myPost = document.querySelector('.myzeazal')

//윈도우 로드시
window.addEventListener('load', function(){
  //사용자 이름으로 넣기
  myIds.forEach(myid => 
    myid.innerText = `${localStorage.getItem('userId')}`
    )
  
  //기존 작성한 게시글 들고오기
  this.fetch('http://127.0.0.1:5002/api/posts/',{
    method: 'GET',
    headers: {
      'Content-Type':'application/json',
      'Authorization':`Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(response => response.json())
    .then(datas => {
      console.log(datas)
      myPost.innerText = `올린 게시글 수 ${datas.posts.length}`
      datas.posts.forEach(post => {
        // console.log(post)
        const mainBox = document.createElement('div')
        mainBox.className = 'main-box'
        mainBox.innerHTML = `
          <div class="zeazal-box">
            <div class="close">${post._id}</div>
            <div class="box-profile">
              <div class="main-profile imgbox">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAIVBMVEXY2Njz8/Pq6urv7+/h4eHb29vo6Oje3t7j4+Pt7e3p6ekmc3lwAAADMElEQVR4nO2bC3KDMAxEMeab+x+4JZQBEkhBlq2NZt8JvGOtPkZUFSGEEEIIIYQQQgghhBBCCCEEnXbo6hjDLzHW3dBan0dEO9ThjfrrxDQHKv60NNZnu0ETz2Q8w+xbpPQfZTyl9NZnvEB7GlS7AIP3SnNFxgR4fHVXdYTQWZ/1A+14XUcII2x4tf+6fE8EVXJXB6qS+zpAldzyx8Jofep3buSrLXC563L9eAWsnrRSHSFg2eRSX3JMbX32Lb1cRwhIHaQg865E69OviJ0+g+P3pAsBupLEC8G5koSUNQOSuBJqyAJGLRnShQzWGp4kRxZKbKXrCMFaw4SCRTBMomARDJMIB5E9CGOJgtcx3J7Yn8wgdCluhGjogMi/FEIhmXBjdjdC3BRENy2Km6bRTRvvZrDyM+q6eXxw8xzk5oHOz5Opm0dsP58V3Hzo8fPpzc3HUD+fp90sDPhZ4fCzVONnzcnN4pmfVUA/y5mVm3XZys8Cs5+V8srNkv+Ek98uJpz8CDPh5NekGRc/ixFCCCHky2mb4TGO8cLkHuM4PoYGsGfph1r0Ih/rAWc2Oexz74DRE59PHre0GE8pvcoiykxnF2O96Ln3nNFGSqMs4ymlfIT9/1Qio/ADS6vojVe6gilMZUXrnFKbKfeeqiWUed5OXti4QgHTZ3THltxv9fnDaiFveOVKukfkTMRJmxr3yaakiM23ZLJ8cR2ZlBjoyKKksD8W1H1ipENdiWQ/QwflrYJidfAd1b2bQn3JMYrdiknCWlFLXSo/VqSgZRNDg8wo2STzPHgFlZnRPLAmNILLNGMtKGQus5K+J73Am5X0PckL9MYlZCW1mJin3oXEFAzikIk0l8BcSOKVAF1I2pVA1JCFlFpiffY9ch0wuXdGnoFVvnPqIf6JCaJd3CJtHQH69z3Sbh4ssuSxZX3ud2Q6oKrhjKwmwllEahI4i0hNAjJSbZGNV9anPkKiA64cTkhKIlijNSNptwCTlixtPawPfcRDIARoyl2RzLtuhACWEVkhcSPE+szHUAgaFIIGhaBBIWhQCBoUggaFoEEhaFAIGhSCBoWgQSFoUAgap8f9Ac1KQOtCVp1TAAAAAElFTkSuQmCC" alt="">
              </div>
              <div class="link">
                <a href="/">좋아요</a>
                <a href="/">링크따기</a>
              </div>
            </div>
            <div class="content-box">
              <div class="id-box">
                <h3 class="myID">${post.author.userId}</h3>
                <div class="date">${post.createPost}</div>
                <div class="btn">
                  <button class="repost">수정</button>
                  <button>삭제</button>
                </div>
              </div>
              <div class="main-content" contenteditable="false">
                ${post.post}
              </div>
            </div>
          </div>
          <div class="reaple-box">
            <h3 class="myID">${post.author.userId}</h3>
            <div class="reaple-content" contenteditable></div>
            <button>OK</button>
          </div>
        ` 
        copyCon.append(mainBox)
        // const uploadIn = mainBox.firstElementChild.lastElementChild.lastElementChild
        // console.log(uploadIn)
        // const div = document.createElement('div')
        // uploadIn.append(div)
        // if(post.imgurl.length !== 0){
        //   const img = document.createElement('img')
        //   img.src = post.imgurl
        //   div.append(img)
        // }else if(post.vedioUrl.length !==0){
        //   const video = document.createElement('video')
        //   vedio.src = post.vedioUrl
        //   div.append(video)
        // }
        //innerHTML로 하면 createURL이 유효하지않음 근데 이것도..

       })
      
    })
    .catch(e => console.log(e))

  mainBox.focus()
  addfiles()
  
})


//로그아웃 버튼 클릭
logoutBtn.addEventListener('click', function() {
  fetch('http://127.0.0.1:5002/api/users/logout',{
      method: 'POST', 
    })
      // .then(response => response.json())
      .then(data => {console.log(data)
          window.location.href = "../../index.html"
        })
      .catch(e => console.log(e))
})


//글쓰기 버튼 클릭
postBtn.addEventListener('click', function(){
  // console.log(mainCon.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.lastElementChild.innerText)
  let textbox = mainCon.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.lastElementChild
  console.log(textbox.firstElementChild)
  const imgs = textbox.querySelectorAll('img')
  const videos = textbox.querySelectorAll('video')
  console.log(textbox)

  if(textbox.childElementCount == 1 && textbox.firstElementChild.innerHTML == '<br>' ){
    alert('빈 게시글입니다.')
  }else{
    //쓴글 화면에 추가
    const mainBox = document.createElement('div')
    mainBox.className = 'main-box'
    mainBox.innerHTML = `
      <div class="zeazal-box">
        <div class="box-profile">
          <div class="main-profile imgbox">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAIVBMVEXY2Njz8/Pq6urv7+/h4eHb29vo6Oje3t7j4+Pt7e3p6ekmc3lwAAADMElEQVR4nO2bC3KDMAxEMeab+x+4JZQBEkhBlq2NZt8JvGOtPkZUFSGEEEIIIYQQQgghhBBCCCEEnXbo6hjDLzHW3dBan0dEO9ThjfrrxDQHKv60NNZnu0ETz2Q8w+xbpPQfZTyl9NZnvEB7GlS7AIP3SnNFxgR4fHVXdYTQWZ/1A+14XUcII2x4tf+6fE8EVXJXB6qS+zpAldzyx8Jofep3buSrLXC563L9eAWsnrRSHSFg2eRSX3JMbX32Lb1cRwhIHaQg865E69OviJ0+g+P3pAsBupLEC8G5koSUNQOSuBJqyAJGLRnShQzWGp4kRxZKbKXrCMFaw4SCRTBMomARDJMIB5E9CGOJgtcx3J7Yn8wgdCluhGjogMi/FEIhmXBjdjdC3BRENy2Km6bRTRvvZrDyM+q6eXxw8xzk5oHOz5Opm0dsP58V3Hzo8fPpzc3HUD+fp90sDPhZ4fCzVONnzcnN4pmfVUA/y5mVm3XZys8Cs5+V8srNkv+Ek98uJpz8CDPh5NekGRc/ixFCCCHky2mb4TGO8cLkHuM4PoYGsGfph1r0Ih/rAWc2Oexz74DRE59PHre0GE8pvcoiykxnF2O96Ln3nNFGSqMs4ymlfIT9/1Qio/ADS6vojVe6gilMZUXrnFKbKfeeqiWUed5OXti4QgHTZ3THltxv9fnDaiFveOVKukfkTMRJmxr3yaakiM23ZLJ8cR2ZlBjoyKKksD8W1H1ipENdiWQ/QwflrYJidfAd1b2bQn3JMYrdiknCWlFLXSo/VqSgZRNDg8wo2STzPHgFlZnRPLAmNILLNGMtKGQus5K+J73Am5X0PckL9MYlZCW1mJin3oXEFAzikIk0l8BcSOKVAF1I2pVA1JCFlFpiffY9ch0wuXdGnoFVvnPqIf6JCaJd3CJtHQH69z3Sbh4ssuSxZX3ud2Q6oKrhjKwmwllEahI4i0hNAjJSbZGNV9anPkKiA64cTkhKIlijNSNptwCTlixtPawPfcRDIARoyl2RzLtuhACWEVkhcSPE+szHUAgaFIIGhaBBIWhQCBoUggaFoEEhaFAIGhSCBoWgQSFoUAgap8f9Ac1KQOtCVp1TAAAAAElFTkSuQmCC" alt="">
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
    copyCon.append(mainBox)

   
    //쓴글 서버에 등록   
    const imgurl =[]
    imgs.forEach(img => {imgurl.push(img.src )})

    const videoUrl = []
    videos.forEach(video => {videoUrl.push(video.src)})

    fetch('http://127.0.0.1:5002/api/posts/',{
      method: 'POST', 
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        post: textbox.innerHTML,
        imgurl: imgurl,
        vedioUrl: videoUrl,
        createPost: `${dateNow()}`

        // friendUser: req.body.friendUser,
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        localStorage.setItem('imgurl', data.newPost.imgurl)
        localStorage.setItem('videoUrl', data.newPost.videoUrl)
        //로컬저장소에  url 저장..인데..흠..안쓸..듯..
      })
      .catch(e => console.log(e))
    

    textbox.innerText = ''
    textbox.focus()
    addfiles()
    lastCaretLine = textbox.firstChild
    location.reload()


    // 시간날때 글자수제한 설정
    
    
    // console.log(addfiles.lastCaretLine)
  }
})

//게시글 수정.삭제.댓글달기
copyCon.addEventListener('click', function(e){
  const repostBtn = document.querySelector('.repost')
  const contentBox = e.target.parentElement.parentElement.nextElementSibling
  if(e.target.innerText == '수정'){
    //수정하기
    e.target.innerText = '완료'
    contentBox.contentEditable = 'true'
    contentBox.classList.add('boxline')
  }else if(e.target.innerText == '완료'){
    //수정완료
    e.target.innerText = '수정'
    contentBox.innerHTML = contentBox.innerHTML
    contentBox.contentEditable = 'false'
    contentBox.classList.remove('boxline')
  }else if(e.target.innerText == '삭제'){
    //삭제하기
    console.log(e.target.parentElement.parentElement.parentElement.parentElement.parentElement)
    const value = confirm('게시글을 삭제하면 되돌릴수 없습니다.')
    if(value == true){
    copyCon.removeChild(e.target.parentElement.parentElement.parentElement.parentElement.parentElement)
    const id = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
    //서버에서도 삭제
    fetch(`http://127.0.0.1:5002/api/posts/${id}`,{
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
    console.log(e.target.previousElementSibling)
    const reBox = document.createElement('div')
    reBox.className = 'reaple-box'
    reBox.innerHTML = `
      <h3 class="myID">${localStorage.getItem('name')}</h3>
      <div class="reaple-content">${e.target.previousElementSibling.innerText}</div>
      <button class="delete"><span class="material-symbols-outlined">close</span></button>
    `
    e.target.parentElement.parentElement.append(reBox)
    e.target.previousElementSibling.innerText =''
  }else if(e.target.innerText == 'OK' && e.target.previousElementSibling.innerText == ''){
    alert('빈 댓글입니다.')  
  }else if(e.target.innerText == 'close'){
    //댓글 삭제하기
    e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement)
  }
console.log(e.target)

})



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
  console.log(line.nextSibling)
  line.nextSibling.insertAdjacentElement('afterbegin', file)
  // console.log(line.nextSibling.insertAdjacentElement('afterbegin', file))
  line.nextSibling.insertAdjacentElement('afterend', createNewLine())
  // console.log(line.nextSibling.nextSibling)
  return line.nextSibling.nextSibling
}



function addfiles(){
  mainBox.insertAdjacentElement("afterbegin", createNewLine())
  let lastCaretLine = mainBox.firstChild
  //위에 두줄은 따로 빼주면 이미지중복이 일어나지 않을것 - 새로고침넣었더니 괜찮아짐,,
  console.log(lastCaretLine)
  const uploadInput = this.document.querySelector('.upload input')
  uploadInput.addEventListener('change', function(e){
    const files = this.files
    if(files.length > 0){
      for(let file of files){
        const fileType = file.type
        // console.log(fileType)
        // console.log(lastCaretLine.nodeType)
        if(fileType.includes('image')){
          const img = document.createElement('img')
          img.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, img)
          // console.log(lastCaretLine)
          // console.log(lastCaretLine.nextSibling)
          lastCaretLine.nextSibling = ''
        }else if(fileType.includes('video')){
          const video = document.createElement('video')
          video.controls = true
          video.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, video)
        }
      }
    }
    // console.log(lastCaretLine)
    //커서 위치 추가한 파일아래 보이기
    const selection = document.getSelection()
    selection.removeAllRanges()

    const range = document.createRange()
    range.selectNodeContents(lastCaretLine)
    range.collapse()
    selection.addRange(range)
    mainBox.focus()
  })
}

function dateNow(){
  const date = new Date()
  let dateFormat = (`${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`)
  // if(date.getMinutes().length == 1){
  //   (`${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일 ${date.getHours()}:0${date.getMinutes()}`)
  // }else{
  //   (`${date.getFullYear()}년 ${date.getMonth()}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes()}`)
  // }
  return dateFormat
}