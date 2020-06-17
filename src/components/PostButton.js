import React, { useEffect, useState } from 'react'
import app from '../biz/app'
import Link from 'next/link'
import { remove, hasChildren } from './PostButton-fn'
import { withLogger } from '../biz'
import * as R from 'ramda'

function PostButton(props) {
  // const [userId, setUserId] = useState(props.userId)

  // useEffect(() => {
  //   props.logger.debug('effect')
  //   const subscription = app.stateSubject.subscribe((state) => {
  //     props.logger.debug('state 받아 먹음')
  //     setUserId(state.user.id)
  //   })
  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // })

  const { link } = props
  // props.logger.verbose('link.like', link.like)
  const [isLike, setIsLike] = useState(link.like?.includes(props.userId))
  const [isRead, setIsRead] = useState(link.read?.includes(props.userId))
  const [isToread, setIsToread] = useState(link.toread?.includes(props.userId))

  const likeClick = async link => {
    await isLike ? app.api.unlike(link) : app.api.like(link)
    setIsLike(R.not)
  }

  const readClick = async link => {
    await isRead ? app.api.unread(link) : app.api.read(link)
    setIsRead(R.not)
  }

  const toreadClick = async link => {
    await isToread ? app.api.untoread(link) : app.api.toread(link)
    setIsToread(R.not)
  }

  return (
    <>
      <div className={isLike ? 'sns-btn marked' : 'sns-btn'} title="좋아요" onClick={() => likeClick(link)}>
        <i className="icon-thumbs-up" />
      </div>
      <div className={isRead ? 'sns-btn marked' : 'sns-btn'} title="읽음표시" onClick={() => readClick(link)}>
        <i className="icon-ok" />
      </div>
      <div className={isToread ? 'sns-btn marked' : 'sns-btn'} title="읽을 글 표시" onClick={() => toreadClick(link)}>
        <i className="icon-basket" />
      </div>
      <div className="sns-btn comment-btn" title="댓글" onClick={props.commentClick}>
        <i className="icon-comment-empty" />
      </div>
      {!props.isChild && (
        <div className="sns-btn" title="관련글" onClick={props.refClick}>
          <i className="icon-doc-new" />
        </div>
      )}
      {link.author.id === props.userId && (
        <>
          <Link href={`/write?id=${link.id}`}>
            <div className="edit-btn" title="수정">
              <i className="icon-pencil" />
            </div>
          </Link>
          {!hasChildren(link) && (
            <div className="delete-btn" title="삭제" onClick={() => remove(link)}>
              <i className="icon-trash-empty" />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default withLogger(PostButton)
