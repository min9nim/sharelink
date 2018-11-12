import Link from 'next/link';
import app from '../src/app';
import URL from "url-parse";
import moment from "moment";

import "./Post.scss";


moment.locale("ko");  

function removeAnimation(dom, delay) {
  return new Promise(function (resolve) {
    dom.style.transition = `transform ${delay}s ease-in-out`;
    dom.style.transform = "scaleY(0)";
    setTimeout(resolve, delay * 1000);
  })
}

function cancelRemoveAnimation(dom, delay) {
  return new Promise(function (resolve) {
    dom.style.transition = `transform ${delay}s ease-in-out`;
    dom.style.transform = "scaleY(1)";
    setTimeout(resolve, delay * 1000);
  })
}


const remove = async (post, dom) => {
  if (!confirm("삭제합니다")) {
    return;
  }

  // 애니메이션 시작
  await removeAnimation(dom, 0.2)

  // DB 삭제처리
  let json = await app.api.deleteLink(post);
  if(json.status === "Fail"){
    cancelRemoveAnimation(dom, 0.2)
  }
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
  //console.log("Post 렌더링")
  let { hostname } = new URL(link.url);

  const isLike = link.like && link.like.includes(app.user.id);
  const isRead = link.read && link.read.includes(app.user.id);
  const isToread = link.toread && link.toread.includes(app.user.id);

  let dom;  // 삭제 애니메이션 처리를 취해 li 노드를 잠시 담을 임시 변수

  return (
    <li ref={el => { dom = el }}>
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
                {/* <div className="sns-btn" title="댓글" onClick={() => commentClick()}>
                  <i className="icon-comment-empty" />
                </div> */}
              </React.Fragment>
            }
            {
              (link.author.id === app.user.id)
              &&
              <React.Fragment>
                <Link href={`/write?id=${link.id}`}>
                  <div className="edit-btn" title="수정"><i className="icon-pencil" /></div>
                </Link>
                <div className="delete-btn" title="삭제" onClick={() => remove(link, dom)}>
                  <i className="icon-trash-empty" />
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