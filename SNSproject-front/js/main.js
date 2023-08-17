const myIds = document.querySelectorAll('.myID')
const logoutBtn = document.querySelector('.logoutbtn')
const postBtn = document.querySelector('.postbtn')
const mainCon = document.querySelector('.main')
const copyCon = document.querySelector('.copy')
const mainBox = mainCon.querySelector('.main-content')

//윈도우 로드시
window.addEventListener('load', function(){
  //사용자 이름으로 넣기
  myIds.forEach(myid => 
    myid.innerText = `${localStorage.getItem('name')}`
    )

  mainBox.focus()
  addfiles()

  // console.log(copyCon.childElementCount) 나중ㅇ ㅔ올린 게시글수 연동하면될듯
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
  console.log(textbox)
  if(textbox.innerText !==''){
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
          <div class="btn">
            <button class="repost">수정</button>
            <button>삭제</button>
          </div>
        </div>
        <div class="main-content" contenteditable="false">${mainCon.firstElementChild.firstElementChild.firstElementChild.nextElementSibling.lastElementChild.innerHTML}</div>
      </div>
    </div>
    <div class="reaple-box">
      <h3 class="myID">${localStorage.getItem('name')}</h3>
      <div class="reaple-content" contenteditable></div>
      <button>OK</button>
    </div>
  `
  copyCon.append(mainBox)
  textbox.innerText = ''
  textbox.focus()
  addfiles()
 // 시간나면 글자수제한 설정
  }else{
    alert('빈 게시글입니다.')
  }
})

//게시글 수정.삭제.댓글달기
copyCon.addEventListener('click', function(e){
  const repostBtn = document.querySelector('.repost')
  const contentBox = e.target.parentElement.parentElement.nextElementSibling
  if(e.target.innerText == '수정'){
    //수정하기
    repostBtn.innerText = '완료'
    contentBox.contentEditable = 'true'
    contentBox.classList.add('boxline')
  }else if(e.target.innerText == '완료'){
    //수정완료
    repostBtn.innerText = '수정'
    contentBox.innerHTML = contentBox.innerHTML
    contentBox.contentEditable = 'false'
    contentBox.classList.remove('boxline')
  }else if(e.target.innerText == '삭제'){
    //삭제하기
    console.log(e.target.parentElement.parentElement.parentElement.parentElement.parentElement)
    const value = confirm('게시글을 삭제하면 되돌릴수 없습니다.')
    if(value == true){
    copyCon.removeChild(e.target.parentElement.parentElement.parentElement.parentElement.parentElement)
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
  line.nextSibling.insertAdjacentElement('afterbegin', file)
  line.nextSibling.insertAdjacentElement('afterend', createNewLine())
  return line.nextSibling.nextSibling
}



function addfiles(){
  mainBox.insertAdjacentElement("afterbegin", createNewLine())
  let lastCaretLine = mainBox.firstChild
  console.log(lastCaretLine)
  const uploadInput = this.document.querySelector('.upload input')
  uploadInput.addEventListener('change', function(e){
    const files = this.files
    if(files.length > 0){
      for(let file of files){
        const fileType = file.type
        console.log(fileType)
        console.log(lastCaretLine.nodeType)
        if(fileType.includes('image')){
          const img = document.createElement('img')
          img.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, img)
        }else if(fileType.includes('video')){
          const video = document.createElement('video')
          video.controls = true
          video.src = URL.createObjectURL(file)
          lastCaretLine = addFileToCurrentLine(lastCaretLine, video)
        }
      }
    }
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