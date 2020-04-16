import Post from './Post.js'
import LinkLoading from './LinkLoading.js'
import './List.scss'
import React, { useEffect, useState } from 'react'
import { infiniteLoading } from './list-fn'
import { withLogger } from '../biz'
import { isAddMode } from './search-fn'

function List(props) {
  const logger = props.logger
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    logger
      .addTags('effecct')
      .verbose('props.state.links.length:', props.state.links.length)
    // const unsubscribes = imageLazyLoad()
    const unsubscribe = infiniteLoading({ logger, setLoading })
    return () => {
      // logger.debug('마지막 요소 지켜보기 설정 해제')
      unsubscribe()
      // logger.debug('이미지dom 지켜보기 설정 해제')
      // unsubscribes.map((unsubscribe) => unsubscribe())
    }
  }, [props.state.links.length])

  // logger.verbose('체크44', props.state)
  const intro =
    !isAddMode(props.state.word) && props.state.searched
      ? `"${props.state.word}" 검색 결과`
      : props.state.menu[props.state.menuIdx].label

  const { links, totalCount } = props.state

  logger.verbose('render', props.state.links.length)

  return (
    <>
      <div className="intro">{'* ' + intro + '(' + totalCount + '개)'}</div>
      <ul className="PostList">
        {links.map((link, idx) => (
          <Post key={link.id} link={link} state={props.state} idx={idx} />
        ))}
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
