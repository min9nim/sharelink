import Link from 'next/link';
import app from '../src/app';
import URL from "url-parse";
import moment from "moment";

import "./Post.scss";


const remove = async (post) => {
  if (!confirm("삭제합니다")) {
    return;
  }
  app.api.deleteLink(post.id);
}

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
const commentClick = () => {
  alert("준비 중");
}

const Post = ({ link }) => {
  let { hostname } = new URL(link.url);


  // console.log(link.author.id);
  // console.log(app.user.id)
  // console.log(link.author.id === app.user.id);

  const isLike = link.like.includes(app.user.id);
  const isRead = link.read.includes(app.user.id);
  const isToread = link.toread.includes(app.user.id);

  return (
    <li>
      <div className="wrapper">
        <div className="left">
          <div className="title">
            <a href={link.url} target="_blank">{link.title}</a>
          </div>
          <div className="meta">
            <div className="url">{hostname}</div>
            <div className="author-name">{link.author && " | by " + link.author.name}</div>
            <div className="updatedAt">{link.updatedAt && "| " + moment(link.updatedAt).fromNow()}</div>
          </div>
          <div className="desc">
            {link.desc}
          </div>
          <div className="post-menu">
            {
              app.auth.isLogin() &&
              <React.Fragment>
                <div className={isLike ? "sns-btn marked" : "sns-btn"} title="좋아요" onClick={() => likeClick(isLike, link)}>
                  <i className="icon-thumbs-up" />
                </div>
                <div className={isRead ? "sns-btn marked" : "sns-btn"} title="읽음표시" onClick={() => readClick(isRead, link)}>
                  <i className="icon-ok" />
                </div>
                <div className={isToread ? "sns-btn marked" : "sns-btn"} title="읽을 글 표시" onClick={() => toreadClick(isToread, link)}>
                  <i className="icon-basket" />
                </div>
                <div className="sns-btn" title="댓글" onClick={() => commentClick()}>
                  <i className="icon-comment-empty" />
                </div>
              </React.Fragment>
            }
            {
              (link.author.id === app.user.id)
              &&
              <React.Fragment>
                <Link href={`/write?id=${link.id}`}>
                  <div className="edit-btn" title="수정"><i className="icon-pencil" />수정</div>
                </Link>
                <div className="delete-btn" title="삭제" onClick={() => remove(link)}>
                  <i className="icon-trash-empty" />삭제
              </div>
              </React.Fragment>
            }
          </div>

        </div>
        <div className="right">
          <img src={link.image}></img>
        </div>
      </div>
    </li>
  )
}

export default Post;