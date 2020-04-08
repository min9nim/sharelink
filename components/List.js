import Layout from './Layout.js'
import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import app from '../src/app'
import './List.scss'

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
      () =>
        app.api.fetchList({
          menuIdx: app.state.menuIdx,
          idx: app.state.links.length,
          cnt: app.PAGEROWS,
        }),
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
    observeDom(lastPost, () =>
      app.api.fetchList({
        menuIdx: app.state.menuIdx,
        idx: app.state.links.length,
        cnt: app.PAGEROWS,
      }),
    )
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

function observeDom(dom, callback) {
  new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return
      }
      callback(entry.target)
      observer.unobserve(entry.target)
    })
  }).observe(dom)
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
  lazyloadImages.forEach((item) => observeDom(item, loadImage))
}
