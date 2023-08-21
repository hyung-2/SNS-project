class Scroller{
  #isScrolling
  #scrollEndTimer

  constructor(isScrolling){
    this.#isScrolling = isScrolling
    this.#scrollEndTimer = null
  }

  getScrollPosition(){ //현재 스크롤 위치
    return window.pageYOffset
  }

  setScrollPosition(p){ //해당 위치로 스크롤링
    window.scrollTo(p)
    this.#setScrollState(true)
  }

  getScrollState(){ //스크롤 상태 조회
    return this.#isScrolling
  }

  #setScrollState(state){ //스크롤 상태 변경
    this.#isScrolling = state
  }
  isScrollend(){ //스크롤 끝남 감지
    return new Promise((resolve, reject) => {
      clearTimeout(this.#scrollEndTimer)
      this.#scrollEndTimer = setTimeout(() => {
        //스크롤이 끝난 상태
        this.#setScrollState(false)
        resolve()
      }, 100)
    })
  }
}