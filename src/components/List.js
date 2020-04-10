import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import app from '../app'
import './List.scss'
import React, { useState, useEffect } from 'react'
import { map } from 'ramda'

let logger
export default function List(props) {
  logger = app.logger.addTags('List')
  logger.debug('List start', props.state.links.length)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.fetchRes) {
      app.state.totalCount = props.fetchRes.totalCount
      app.state.links = props.fetchRes.links
    }
  }, [props.fetchRes])

  useEffect(() => {
    logger.debug('effect', props.state.links.length)
    const unsubscribes = imageLazyLoad()
    const unsubscribe = infiniteLoading()
    return () => {
      logger.debug('마지막 요소 지켜보기 설정 해제')
      unsubscribe()

      logger.debug('이미지dom 지켜보기 설정 해제')
      unsubscribes.map((unsubscribe) => unsubscribe())
    }
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
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return
      }
      callback(entry.target)
      observer.unobserve(entry.target)
    })
  })
  observer.observe(dom)
  return () => {
    observer.unobserve(dom)
  }
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

  return map((item) => observeDom(item, loadImage))(lazyloadImages)
}

function infiniteLoading() {
  const lastPost = document.querySelector(
    '.PostList > li:last-child > .wrapper',
  )

  if (!lastPost) {
    logger.verbose('not found lastPost')
    return () => {}
  }
  logger.debug('마지막 요소 지켜보기 설정')

  return observeDom(lastPost, () => {
    logger.debug('observeDom lastPost fetch call', app.state.links.length)
    app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: app.state.links.length,
      cnt: app.PAGEROWS,
    })
  })
}
