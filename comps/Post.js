import Link from 'next/link';
import app from '../src/app';
import moment from "moment";
import $m from "../com/util.js";
import {_getHostname} from "../com/pure";
import CommentWrite from "./CommentWrite";
import CommentList from "./CommentList";
import RefWrite from "./RefWrite";
import RefPostList from "./RefPostList";


import "./Post.scss";

moment.locale("ko");



const remove = async (post, dom) => {
  if (!confirm("삭제합니다")) {
    return;
  }

  // 애니메이션 시작
  //await $m.removeAnimation(dom, 0.2)
  $m.removeAnimation(dom, 0.2)

  // DB 삭제처리
  let json = await app.api.deleteLink(post);
  if (json.status === "Fail") {
    $m.cancelRemoveAnimation(dom, 0.2)
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



class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      commentClicked: false,
      refClicked: false
    }
  }


  commentClick() {
    this.setState({
      commentClicked: !this.state.commentClicked,
      refClicked: false
    })
  }


  refClick() {
    this.setState({
      refClicked: !this.state.refClicked,
      commentClicked: false
    })
  }

  render() {
    // console.log("Post 렌더링 " + this.state.commentClicked)
    const { link } = this.props;
    const isLike = link.like && link.like.includes(app.user.id);
    const isRead = link.read && link.read.includes(app.user.id);
    const isToread = link.toread && link.toread.includes(app.user.id);

    return (
      <li ref={el => { this.dom = el }}>
        <div className="wrapper">
          <div className="left">
            <div className="title">
              <a href={link.url} target="_blank" dangerouslySetInnerHTML={{ __html: $m.highlight($m.htmlspecialchars(link.title), app.state.word) }}></a>
            </div>
            <div className="meta">
              <div className="url">{_getHostname(link.url)}</div>
              <div className="author-name">{link.author && " | by " + link.author.name}</div>
              <div className="updatedAt">{link.updatedAt && "| " + moment(link.updatedAt).fromNow()}</div>
            </div>
            <div className="desc" dangerouslySetInnerHTML={{ __html: $m.highlight($m.htmlspecialchars(link.desc), app.state.word) }}>
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
                  <div className="sns-btn comment-btn" title="댓글" onClick={this.commentClick.bind(this)}>
                    <i className="icon-comment-empty" />
                  </div>
                  <div className="sns-btn" title="관련글" onClick={this.refClick.bind(this)}>
                    <i className="icon-doc-new" />
                  </div>

                </React.Fragment>
              }
              {
                app.auth.isLogin() && (link.author.id === app.user.id)
                &&
                <React.Fragment>
                  <Link href={`/write?id=${link.id}`}>
                    <div className="edit-btn" title="수정"><i className="icon-pencil" /></div>
                  </Link>
                  {
                    (!link.refLinks || link.refLinks.length === 0)
                    &&
                    <div className="delete-btn" title="삭제" onClick={() => remove(link, this.dom)}>
                      <i className="icon-trash-empty" />
                    </div>
                  }
                </React.Fragment>
              }
            </div>
            {
              this.state.commentClicked &&
              <CommentWrite linkID={link.id} commentClick={this.commentClick.bind(this)} />
            }
            {
              this.state.refClicked &&
              <RefWrite linkID={link.id} refClick={this.refClick.bind(this)} />
            }
            <CommentList comments={link.comments} />

          </div>
          <div className="right">
            <img src={link.image}></img>
          </div>

        </div>
        {
          link.refLinks &&
          <RefPostList refLinks={link.refLinks} />
        }

      </li>
    )
  }
}

export default Post;