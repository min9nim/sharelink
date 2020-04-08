import app from '../src/app'
import moment from 'moment'
import { _getHostname, htmlspecialchars } from '../com/pure'
import CommentWrite from './CommentWrite'
import CommentList from './CommentList'
import RefWrite from './RefWrite'
import { highlight } from 'mingutils'
import PostButton from './PostButton'
import './RefPost.scss'

moment.locale('ko')

class RefPost extends React.Component {
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
            <img src={link.image}></img>
          </div>
        </div>
      </li>
    )
  }
}

export default RefPost
