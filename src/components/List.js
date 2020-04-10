import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import app from '../app'
import './List.scss'
import React, { useEffect } from 'react'
import { infiniteLoading, imageLazyLoad } from './list-fn'
import { withLogger } from '../com/pure.js'

function List(props) {
  const logger = props.logger
  logger.debug('List start', props.state.links.length)

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

  const intro = app.state.word
    ? `"${app.state.word}" 검색 결과`
    : props.state.menu[props.state.menuIdx].label

  const { links, totalCount } = props.state

  return (
    <>
      <div className="intro">{'* ' + intro + '(' + totalCount + '개)'}</div>
      <ul className="PostList">
        {links.map((link) => {
          return <Post key={link.id} link={link} />
        })}
      </ul>
      <LinkLoading />
      <LinkLoading />
      <LinkLoading />
      <LinkLoading />
      <LinkLoading />
      <LinkLoading />
      <LinkLoading />
      <LinkLoading />
    </>
  )
}

export default withLogger(List)
