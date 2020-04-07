import Link from 'next/link'
import app from '../src/app'
import moment from 'moment'
import $m, { createTimelog } from '../com/util'
import { _getHostname, htmlspecialchars } from '../com/pure'
import CommentWrite from './CommentWrite'
import CommentList from './CommentList'
import RefWrite from './RefWrite'
import RefPostList from './RefPostList'
import { highlight } from 'mingutils'
import PostButton from './PostButton'

import './Post.scss'

moment.locale('ko')

const remove = async (post, dom) => {
  if (!confirm('삭제합니다')) {
    return
  }

  // 애니메이션 시작
  //await $m.removeAnimation(dom, 0.2)
  $m.removeAnimation(dom, 0.2)

  // DB 삭제처리
  let json = await app.api.deleteLink(post)
  if (json.status === 'Fail') {
    $m.cancelRemoveAnimation(dom, 0.2)
  }
}

class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      commentClicked: false,
      refClicked: false,
    }
  }

  commentClick() {
    this.setState({
      commentClicked: !this.state.commentClicked,
      refClicked: false,
    })
  }

  refClick() {
    this.setState({
      refClicked: !this.state.refClicked,
      commentClicked: false,
    })
  }

  render() {
    // console.log("Post 렌더링 " + this.state.commentClicked)
    const { link } = this.props

    return (
      <li
        ref={(el) => {
          this.dom = el
        }}
      >
        <div className="wrapper">
          <div className="left">
            <div className="title">
              <a
                href={link.url}
                target="_blank"
                dangerouslySetInnerHTML={{
                  __html: highlight(app.state.word)(
                    htmlspecialchars(link.title),
                  ),
                }}
              ></a>
            </div>
            <div className="meta">
              <img
                className="lazy favicon"
                data-src={link.favicon}
                src="/static/loading.gif"
              />
              <div className="url">{_getHostname(link.url)}</div>
              <div className="author-name">
                {link.author && ' | by ' + link.author.name}
              </div>
              <div className="updatedAt">
                {link.updatedAt && '| ' + moment(link.updatedAt).fromNow()}
              </div>
            </div>
            <div
              className="desc"
              dangerouslySetInnerHTML={{
                __html: highlight(app.state.word)(htmlspecialchars(link.desc)),
              }}
            ></div>
            <div className="post-menu">
              {app.auth.isLogin() && (
                <PostButton
                  link={link}
                  commentClick={() => this.commentClick()}
                  refClick={() => this.refClick()}
                />
              )}
              {app.auth.isLogin() && link.author.id === app.user.id && (
                <React.Fragment>
                  <Link href={`/write?id=${link.id}`}>
                    <div className="edit-btn" title="수정">
                      <i className="icon-pencil" />
                    </div>
                  </Link>
                  {(!link.refLinks || link.refLinks.length === 0) && (
                    <div
                      className="delete-btn"
                      title="삭제"
                      onClick={() => remove(link, this.dom)}
                    >
                      <i className="icon-trash-empty" />
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
            {this.state.commentClicked && (
              <CommentWrite
                linkID={link.id}
                commentClick={this.commentClick.bind(this)}
              />
            )}
            {this.state.refClicked && (
              <RefWrite linkID={link.id} refClick={this.refClick.bind(this)} />
            )}
            <CommentList comments={link.comments} />
          </div>
          <div className="right">
            <img
              className="lazy"
              data-src={link.image}
              src="/static/loading.gif"
            ></img>
          </div>
        </div>
        {link.refLinks && <RefPostList refLinks={link.refLinks} />}
      </li>
    )
  }
}

export default Post
