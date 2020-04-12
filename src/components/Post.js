import app from '../biz/app'
import moment from 'moment'
import { _getHostname, isExpired } from '../biz'
import { htmlspecialchars } from '../biz/util'
import CommentWrite from './CommentWrite'
import CommentList from './CommentList'
import RefWrite from './RefWrite'
import RefPostList from './RefPostList'
import { highlight } from 'mingutils'
import PostButton from './PostButton'

import './Post.scss'

moment.locale('ko')

export default class Post extends React.Component {
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
    const { link } = this.props
    const isLogin = !isExpired(this.props.state.user?.exp * 1000)

    return (
      <li id={link.id}>
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
                  isChild={this.props.isChild}
                  link={link}
                  userId={this.props.state.user.id}
                  commentClick={() => this.commentClick()}
                  refClick={() => this.refClick()}
                />
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
