import Layout from './Layout.js'
import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import app from '../src/app'
import './List.scss'
// import { timelog } from '../com/util.js'

export default class List extends React.Component {
  constructor(props) {
    // timelog.check('List 생성자 호출')

    super(props)
    this.state = {
      loading: false,
    }

    app.view.List = this

    if (props.user && props.user.id) {
      app.state.userID = props.user.id
      app.user = props.user
      global.sessionStorage &&
        global.sessionStorage.setItem('user', JSON.stringify(app.user))
    } else {
      if (global.document) {
        // 클라이언트에서 실행시
        app.auth.signOut()
      }
    }

    app.state.menuIdx = props.menuIdx
    if (props.fetchRes) {
      app.state.totalCount = props.fetchRes.totalCount
      app.state.isScrollLast = !props.fetchRes.hasNext
      app.state.links = props.fetchRes.links
    }
  }

  static async getInitialProps({ req, asPath }) {
    let menuIdx = app.state.menu.findIndex((m) => m.path === asPath)
    let [user, fetchRes] = await Promise.all([
      app.getUser(req),
      app.api.fetchList({ menuIdx }),
    ])
    return {
      menuIdx,
      fetchRes,
      user,
    }
  }

  componentDidMount() {
    this._ismounted = true

    /**
     * 18.11.02
     * delay를 줘도 스크롤 위치 보정이 잘 안된다;
     */
    // console.log("이동할 스크롤 위치 값 = " + app.scrollTop);
    setTimeout(function () {
      app.$m.scrollTo(0, app.scrollTop) // 이전 스크롤 위치로 복원
      // console.log("이동 후스크롤 위치 값 = " + app.scrollTop);
    }, 1000)

    // global.document.body.onscroll = onscroll
    observeDom(
      document.querySelector('.PostList > li:last-child > .wrapper'),
      async () => {
        console.log('마지막 요소 출현..')
        let json = await app.api.fetchList({
          menuIdx: app.state.menuIdx,
          idx: app.state.links.length,
          cnt: app.PAGEROWS,
        })

        //if (links.length < app.PAGEROWS) {

        // app.state.isScrollLast = !json.hasNext
      },
    )

    imageLazyLoad()
  }
  componentDidUpdate() {
    imageLazyLoad()
    const lastPost = document.querySelector(
      '.PostList > li:last-child > .wrapper',
    )
    console.log('lastPost', lastPost)
    if (!lastPost) {
      return
    }
    observeDom(lastPost, async () => {
      console.log('마지막 요소 출현..')
      let json = await app.api.fetchList({
        menuIdx: app.state.menuIdx,
        idx: app.state.links.length,
        cnt: app.PAGEROWS,
      })

      //if (links.length < app.PAGEROWS) {

      // app.state.isScrollLast = !json.hasNext
    })
  }

  componentWillUnmount() {
    this._ismounted = false
    //console.log("저장된 스크롤 값 = " + app.scrollTop)
    global.document.body.onscroll = undefined
  }

  render() {
    let intro = app.state.menu[app.state.menuIdx].label

    if (
      app.view.Search &&
      app.view.Search.state.mode === 'search' &&
      app.state.word
    ) {
      intro = `"${app.state.word}" 검색 결과`
    }

    //console.log("app.state.links = " + JSON.stringify(app.state.links, null, 2))

    //console.log("@@ app.state.totalCount = " + app.state.totalCount);
    return (
      <Layout>
        <div className="intro">
          {'* ' + intro + '(' + app.state.totalCount + '개)'}
        </div>
        {/* <div className="intro">{"* " + intro}</div> */}
        <ul className="PostList">
          {app.state.links.map((link) => {
            return <Post key={link.id} link={link} />
          })}
          {this.state.loading &&
            [0, 1, 2, 3, 4].map((v) => <LinkLoading key={v} />)}
        </ul>
      </Layout>
    )
  }
}

const onscroll = async () => {
  // if (global.location.pathname !== "/") {
  //   // 목록화면이 아니면 리턴
  //   return;
  // }

  // 현재 목록화면 scrollTop 의 값
  const scrollTop = Math.floor(
    Math.max(document.documentElement.scrollTop, document.body.scrollTop),
  )

  // 현재 스크롤 값을 전역변수에 저장
  app.scrollTop = scrollTop

  if (app.state.isScrollLast) return

  /**
   * 18.11.05
   * 추가 10개 로드전 다시한번 요청이 올라가는 문제를 막기위해 아래 조건 추가
   */
  if (app.view.List.state.loading) return

  //현재문서의 높이
  const scrollHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  )
  //현재 화면 높이 값
  const clientHeight = document.documentElement.clientHeight

  // console.log("scrollTop : " + scrollTop)
  // console.log("clientHeight : " + clientHeight)
  // console.log("scrollHeight : " + scrollHeight)

  if (
    scrollTop + clientHeight == scrollHeight || // 일반적인 경우(데스크탑: 크롬/파폭, 아이폰: 사파리)
    //(app.isMobileChrome() && (scrollTop + clientHeight === scrollHeight - 56))   // 모바일 크롬(55는 위에 statusbar 의 높이 때문인건가)
    (app.isMobileChrome() && scrollTop + clientHeight > scrollHeight - 10) // 모바일 크롬(55는 위에 statusbar 의 높이 때문인건가)
  ) {
    console.log('api calll ')

    //let path = app.state.menu[app.state.menuIdx].path;
    let json = await app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: app.state.links.length,
      cnt: app.PAGEROWS,
    })

    //if (links.length < app.PAGEROWS) {

    app.state.isScrollLast = !json.hasNext

    if (!json.hasNext) {
      console.log('All links loaded')
    }
  }
}

function observeDom(dom, callback) {
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }
        callback(entry.target)
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.5 },
  ).observe(dom)
}

function imageLazyLoad() {
  const loadImage = (img) => {
    if (img.dataset.src) {
      img.src = img.dataset.src
    } else {
      img.removeAttribute('src')
    }
    img.removeAttribute('data-src')
    img.classList.remove('lazy')
  }
  const lazyloadImages = document.querySelectorAll('.lazy')
  console.log('lazyloadImages.length', lazyloadImages.length)
  lazyloadImages.forEach((item) => observeDom(item, loadImage))
}

function imageLazyLoadPolyfill() {
  let timeout
  function lazyload() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(function () {
      let lazyloadImages = document.querySelectorAll('img.lazy')
      lazyloadImages.forEach(function (img) {
        if (img.offsetTop >= window.innerHeight + window.pageYOffset) {
          return
        }
        if (img.dataset.src) {
          img.src = img.dataset.src
        } else {
          img.removeAttribute('src')
        }
        img.removeAttribute('data-src')
        img.classList.remove('lazy')
      })
      if (lazyloadImages.length == 0) {
        document.removeEventListener('scroll', lazyload)
        window.removeEventListener('resize', lazyload)
        window.removeEventListener('orientationChange', lazyload)
      }
    }, 500)
  }
  lazyload()
  document.addEventListener('scroll', lazyload)
  window.addEventListener('resize', lazyload)
  window.addEventListener('orientationChange', lazyload)
}
