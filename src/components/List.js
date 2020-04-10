import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import app from '../app'
import './List.scss'
import React, { useState, useEffect } from 'react'

export default function List(props) {
  app.logger.debug('List start', props.state.links.length)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.fetchRes) {
      app.state.totalCount = props.fetchRes.totalCount
      app.state.links = props.fetchRes.links
    }
  }, [props.fetchRes])

  useEffect(() => {
    app.logger.debug('props.state.links 변화 감지', props.state.links.length)

    imageLazyLoad()
    infiniteLoading()
  }, [props.state.links.length])

  let intro = props.state.menu[props.state.menuIdx].label

  if (
    app.view.Search &&
    app.view.Search.state.mode === 'search' &&
    app.state.word
  ) {
    intro = `"${app.state.word}" 검색 결과`
  }
  const { links, totalCount } = props.state

  return (
    <>
      <div className="intro">{'* ' + intro + '(' + totalCount + '개)'}</div>
      {/* <div className="intro">{"* " + intro}</div> */}
      <ul className="PostList">
        {links.map((link) => {
          return <Post key={link.id} link={link} />
        })}
        {loading && [0, 1, 2, 3, 4].map((v) => <LinkLoading key={v} />)}
      </ul>
    </>
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
    // app.logger.debug('지켜보고 있는 중', app.state.links.length, observingLast)
    return
  }
  const lastPost = document.querySelector(
    '.PostList > li:last-child > .wrapper',
  )
  if (!lastPost) {
    app.logger.verbose('not found lastPost')
    return
  }
  // app.logger.debug(
  //   '마지막 요소 지켜보기 설정:',
  //   app.state.links.length,
  //   observingLast,
  //   lastPost,
  // )
  observeDom(lastPost, () => {
    app.logger.debug('observeDom lastPost fetch call', app.state.links.length)
    app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: app.state.links.length,
      cnt: app.PAGEROWS,
    })
    observingLast = false
  })
  observingLast = true
}
