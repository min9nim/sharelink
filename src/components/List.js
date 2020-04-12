import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import app from '../biz/app'
import './List.scss'
import React, { useEffect, useState } from 'react'
import { infiniteLoading, imageLazyLoad } from './list-fn'
import { withLogger } from '../biz'
import { isAddMode } from './search-fn'

function List(props) {
  const logger = props.logger
  const [loading, setLoading] = useState(false)
  logger.debug('List start', props.state.links.length)

  useEffect(() => {
    logger.debug('effect', props.state.links.length)
    const unsubscribes = imageLazyLoad()
    const unsubscribe = infiniteLoading({ logger, setLoading })
    return () => {
      logger.debug('마지막 요소 지켜보기 설정 해제')
      unsubscribe()

      logger.debug('이미지dom 지켜보기 설정 해제')
      unsubscribes.map((unsubscribe) => unsubscribe())
    }
  }, [props.state.links.length])

  logger.verbose('체크44', props.state)
  const intro = !isAddMode(app.state.word)
    ? props.state.menu[props.state.menuIdx].label
    : `"${app.state.word}" 검색 결과`

  const { links, totalCount } = props.state

  return (
    <>
      <div className="intro">{'* ' + intro + '(' + totalCount + '개)'}</div>
      <ul className="PostList">
        {links.map((link) => {
          if (!props.state) {
            logger.verbose('props.state 가 없어서 div 렌더링')
            return (
              <div key={link.id}>
                {JSON.stringify(link, '', 2)} {props.state}
              </div>
            )
          }
          return <Post key={link.id} link={link} state={props.state} />
        })}
      </ul>
      {loading && (
        <>
          <LinkLoading />
          <LinkLoading />
          <LinkLoading />
          <LinkLoading />
          <LinkLoading />
          <LinkLoading />
          <LinkLoading />
          <LinkLoading />
        </>
      )}
    </>
  )
}

export default withLogger(List)
