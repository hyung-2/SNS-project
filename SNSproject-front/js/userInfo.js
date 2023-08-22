const fileInput = document.getElementById('profile')
const imgBox = document.querySelector('.imgbox')
const checkBtn = document.querySelector('.checkbtn')
const logoutBtn = document.querySelector('.logoutbtn')

//이미지 업로드 화면에 보이기
fileInput.addEventListener('change', function(e){
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

  //나중에 정보수정하기 누르면 되게끔..!
  // const formData = new FormData()
  // formData.append('userimg',e.target.files[0])
  // fetch(`http://127.0.0.1:5002/api/users/profile`, {
  //   method: 'POST',
  //   // headers: {
  //   //   'Content-Type':'multipart/form-data',
  //   // },
  //   body: formData
  // })
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch(e => console.log(e))

})

//이메일 중복 검사
checkBtn.addEventListener('click', function(){
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
        })
      .catch(e => console.log(e))
})





//파일 이미지인지 검사
function isValid(type){
  console.log(type.split('/')[0])
  return type.split('/')[0] === 'image'
}