const fileInput = document.getElementById('profile')
const imgBox = document.querySelector('.imgbox')
const checkBtn = document.querySelector('.checkbtn')
const logoutBtn = document.querySelector('.logoutbtn')
const infoBox = document.querySelector('.infobox')
const input = infoBox.querySelectorAll('input')
const deleteBtn = document.querySelector('.delete-btn')
const submitBtn = document.querySelector('.submit-btn')
const noBtn = document.querySelector('.normal')


window.addEventListener('load',function(e){
  e.preventDefault()
  console.log(localStorage.getItem('author'))
  // input[0].value = localStorage.getItem('userId')
  // input[1].value = localStorage.getItem('email')
  //placeholder에 내 정보값 넣기
  fetch(`http://127.0.0.1:5002/api/users/${localStorage.getItem('author')}`, {
    method: 'GET',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        input[0].value = data.user.userId
        input[1].value = data.user.email
        localStorage.setItem('pw', data.user.password)
        imgBox.firstElementChild.src = `${isImgUrl(localStorage.getItem('imgUrl'))}`
      })
      .catch(e => console.log(e))
  




  //이미지 업로드 화면에 보이기
  fileInput.addEventListener('change', function(e){
    console.log(e.target)
    console.log(e.target.files)
    e.stopPropagation()
    if(!isValid(e.target.files[0].type)){
      imgBox.innerHTML = `File type is not valid!`
      return
    }
  
    const img = document.createElement('img')
    img.src = URL.createObjectURL(e.target.files[0])
  
    imgBox.innerHTML = ''
    imgBox.append(img)

  
  })
  
  //이메일 중복 검사
  checkBtn.addEventListener('click', function(e){
    e.stopPropagation()
    fetch(`http://127.0.0.1:5002/api/users/`,{
        method: 'GET',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => response.json())
        .then(datas => {
          console.log(datas)
          datas.user.forEach(data => {
            if(checkBtn.previousElementSibling.value == data.email){
              alert('이미 등록된 Email 입니다.')
            }
            // else if(data._id === localStorage.getItem('author')){
               //현재 사용자 확인
              // console.log(checkBtn.previousElementSibling.value)
              // alert('사용 가능한 Email 입니다.')
            // }
            //else if부분은 정보 수정할때 확인하는게 좋을듯함 (여긴 전체 유저 조회)
            //새로고침해서 버튼누를때 확인을 안거쳐도될듯..왜 새로고침이되지..
          });
        })
        .catch(e => console.log(e))
  })
  
  
  //로그아웃 버튼 클릭
  logoutBtn.addEventListener('click', function() {
    fetch('http://127.0.0.1:5002/api/users/logout',{
        method: 'POST',
      })
        // .then(response => response.json())
        .then(data => {console.log(data)
          window.location.href = "../../index.html"
          window.localStorage.removeItem('author')
          })
        .catch(e => console.log(e))
  })
  
  //계정 삭제하기 버튼 클릭
  deleteBtn.addEventListener('click', function(){
    fetch(`http://127.0.0.1:5002/api/users/${localStorage.getItem('author')}`, {
    method: 'DELETE',
        headers: {
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(data => {
        console.log(data)
        alert(`code:${data.status}, 사용자 정보를 삭제하였습니다.`)
        window.localStorage.removeItem('author')
        window.location.href = "../../index.html"
      })
      .catch(e => console.log(e))
    })


  //프로필 사진 삭제(기본프로필)
  noBtn.addEventListener('click', function(){
    noBtn.nextElementSibling.firstElementChild.src = '../../SNSproject-back/uploads/profile.png'
    console.log(noBtn.nextElementSibling.firstElementChild.src)
    console.log(noBtn.nextElementSibling.firstElementChild.src === 'http://127.0.0.1:5502/SNSproject-back/uploads/profile.png')
  })
  
  //회원정보 수정
  submitBtn.addEventListener('click', function(e){
    e.preventDefault()
    // console.log(localStorage.getItem('pw'))

    if(input[2].value !== localStorage.getItem('pw')){
      alert('현재 비밀번호를 확인해주세요')
      }else if(input[3].value !== input[4].value){
        alert('바꿀 비밀번호를 똑같이 입력해주세요')
      }else if(input[2].value === input[3].value){
        alert('현재 비밀번호와 동일한 비밀번호입니다.')
      }else if(input[2].value === localStorage.getItem('pw')){
        console.log('맞습니다')
        
        if(noBtn.nextElementSibling.firstElementChild.src === 'http://127.0.0.1:5502/SNSproject-back/uploads/profile.png'){
          //기본 프로필 이미지일때
          fetch(`http://127.0.0.1:5002/api/users/${localStorage.getItem('author')}`, {
            method: 'PUT', 
            headers: {
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              userId: input[0].value,
              email: input[1].value,
              password: input[3].value,
              imgUrl: 'false'
            })
          })
            .then(response => response.json())
            .then(data => {
              console.log(data)
              localStorage.setItem('userId', data.userId)
              localStorage.setItem('token', data.token)
              localStorage.removeItem('imgUrl')
              localStorage.setItem('imgUrl', data.imgUrl)
              alert(`code:${data.code}, ${data.message}`)
              window.location.href = "./main.html"
            })
            .catch(e => console.log(e))
        }else{
          //프로필 사진 바꿀때

          //프로필사진 저장
          const formData = new FormData()
          formData.append('userimg',fileInput.files[0])
          fetch(`http://127.0.0.1:5002/api/users/profile`, {
            method: 'POST',
            // headers: {
            //   'Content-Type':'multipart/form-data',
            // },
            body: formData
          })
            .then(response => response.json())
            .then(imgdata => {
              e.preventDefault()
              console.log(imgdata)
              console.log(imgdata.imgUrl)
              
              fetch(`http://127.0.0.1:5002/api/users/${localStorage.getItem('author')}`, {
                method: 'PUT', 
                headers: {
                  'Content-Type':'application/json',
                  'Authorization':`Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  userId: input[0].value,
                  email: input[1].value,
                  password: input[3].value,
                  imgUrl: imgdata.imgUrl
                })
              })
                .then(response => response.json())
                .then(data => {
                  console.log(data)
                  localStorage.setItem('userId', data.userId)
                  localStorage.setItem('token', data.token)
                  alert(`code:${data.code}, ${data.message}`)
                })
                .catch(e => console.log(e))

                localStorage.removeItem('imgUrl')
                localStorage.setItem('imgUrl', imgdata.imgUrl)
                window.location.href = "./main.html"
            })
            .catch(e => console.log(e))
        }
        
        

          }
      })
          

})


//파일 이미지인지 검사
function isValid(type){
  console.log(type.split('/')[0])
  return type.split('/')[0] === 'image'
}


//이미지url검사
function isImgUrl(f){
  if(f === 'false'){
    return '../../SNSproject-back/uploads/profile.png'
  }else{
    return `../../SNSproject-back/${localStorage.getItem('imgUrl')}`
  }
}