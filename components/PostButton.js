import React from 'react'

export default function (props) {
  return (
    <React.Fragment>
      <div
        className={props.isLike ? 'sns-btn marked' : 'sns-btn'}
        title="좋아요"
        onClick={props.likeClick}
      >
        <i className="icon-thumbs-up" />
      </div>
      <div
        className={props.isRead ? 'sns-btn marked' : 'sns-btn'}
        title="읽음표시"
        onClick={props.readClick}
      >
        <i className="icon-ok" />
      </div>
      <div
        className={props.isToread ? 'sns-btn marked' : 'sns-btn'}
        title="읽을 글 표시"
        onClick={props.toreadClick}
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
