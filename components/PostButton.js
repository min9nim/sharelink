import React from 'react'
import app from '../src/app'

const likeClick = (isLike, link) => {
  if (isLike) {
    app.api.unlike(link)
  } else {
    app.api.like(link)
  }
}

const readClick = (isRead, link) => {
  if (isRead) {
    app.api.unread(link)
  } else {
    app.api.read(link)
  }
}
const toreadClick = (isToread, link) => {
  if (isToread) {
    app.api.untoread(link)
  } else {
    app.api.toread(link)
  }
}

export default function (props) {
  const { link } = props
  const isLike = link.like && link.like.includes(app.user.id)
  const isRead = link.read && link.read.includes(app.user.id)
  const isToread = link.toread && link.toread.includes(app.user.id)

  return (
    <React.Fragment>
      <div
        className={isLike ? 'sns-btn marked' : 'sns-btn'}
        title="좋아요"
        onClick={() => likeClick(isLike, link)}
      >
        <i className="icon-thumbs-up" />
      </div>
      <div
        className={isRead ? 'sns-btn marked' : 'sns-btn'}
        title="읽음표시"
        onClick={() => readClick(isRead, link)}
      >
        <i className="icon-ok" />
      </div>
      <div
        className={isToread ? 'sns-btn marked' : 'sns-btn'}
        title="읽을 글 표시"
        onClick={() => toreadClick(isToread, link)}
      >
        <i className="icon-basket" />
      </div>
      <div
        className="sns-btn comment-btn"
        title="댓글"
        onClick={props.commentClick}
      >
        <i className="icon-comment-empty" />
      </div>
      <div className="sns-btn" title="관련글" onClick={props.refClick}>
        <i className="icon-doc-new" />
      </div>
    </React.Fragment>
  )
}
