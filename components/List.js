import Layout from './Layout.js'
import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import app from '../src/app'
import './List.scss'
import React, { useState, useEffect } from 'react'

export default function List(props) {
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    app.state.menuIdx = props.menuIdx
    if (props.fetchRes) {
      app.state.totalCount = props.fetchRes.totalCount
      app.state.links = props.fetchRes.links
    }
  }, [props.fetchRes])

  useEffect(() => {
    List._ismounted = true
    /**
     * 18.11.02
     * delay를 줘도 스크롤 위치 보정이 잘 안된다;
     */
    // console.log("이동할 스크롤 위치 값 = " + app.scrollTop);
    setTimeout(function () {
      app.$m.scrollTo(0, app.scrollTop) // 이전 스크롤 위치로 복원
      // console.log("이동 후스크롤 위치 값 = " + app.scrollTop);
    }, 1000)

    imageLazyLoad()
    infiniteLoading()
    return () => {
      List._ismounted = false
    }
  })

  let intro = app.state.menu[app.state.menuIdx].label

  if (
    app.view.Search &&
    app.view.Search.state.mode === 'search' &&
    app.state.word
  ) {
    intro = `"${app.state.word}" 검색 결과`
  }
  const { links, totalCount } = props.state
  console.log('List render', props.state, totalCount, props.state.totalCount)

  return (
    <Layout>
      <div className="intro">{'* ' + intro + '(' + totalCount + '개)'}</div>
      {/* <div className="intro">{"* " + intro}</div> */}
      <ul className="PostList">
        {links.map((link) => {
          return <Post key={link.id} link={link} />
        })}
        {loading && [0, 1, 2, 3, 4].map((v) => <LinkLoading key={v} />)}
      </ul>
    </Layout>
  )
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

let observingLast = false
function infiniteLoading() {
  if (observingLast) {
    app.logger.debug('지켜보고 있는 중', app.state.links.length, observingLast)
    return
  }
  const lastPost = document.querySelector(
    '.PostList > li:last-child > .wrapper',
  )
  if (!lastPost) {
    app.logger.verbose('not found lastPost')
    return
  }
  app.logger.debug(
    '마지막 요소 지켜보기 설정:',
    app.state.links.length,
    observingLast,
  )
  observeDom(lastPost, () => {
    app.logger.debug('fetch call')
    app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: app.state.links.length,
      cnt: app.PAGEROWS,
    })
    observingLast = false
  })
  observingLast = true
}
