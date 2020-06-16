import app from '../biz/app'
import moment from 'moment'
import { _getHostname, withLogger } from '../biz'
import { htmlspecialchars, observeDom } from '../biz/util'
import CommentWrite from './CommentWrite'
import CommentList from './CommentList'
import RefWrite from './RefWrite'
import RefPostList from './RefPostList'
import { highlight } from 'mingutils'
import PostButton from './PostButton'
import { decorate, observable, reaction, action } from 'mobx'
import './Post.scss'
import { isAddable } from './search-fn'

const loadImage = img => {
  if (img.dataset.src) {
    img.src = img.dataset.src
  } else {
    img.removeAttribute('src')
  }
  img.removeAttribute('data-src')
  img.classList.remove('lazy')
}

class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      commentClicked: false,
      refClicked: false,
    }

    // action(
    //   this,
    //   'commentClick',
    //   Object.getOwnPropertyDescriptor(this.__proto__, 'commentClick'),
    // )
  }

  commentClick() {
    Object.assign(this.state, {
      commentClicked: !this.state.commentClicked,
      refClicked: false,
    })
  }

  componentDidMount() {
    observeDom(this.favicon, loadImage)
    observeDom(this.image, loadImage)

    reaction(
      () => JSON.stringify(this.state),
      () => {
        // props.logger.verbose('forceUpdate')
        this.forceUpdate()
      },
    )
  }

  async refClick() {
    if (!this.state.refClicked) {
      try {
        const text = await navigator.clipboard.readText()
        if (isAddable(text)) {
          await app.api.postLink({
            linkID: this.props.link.id,
            url: text,
            author: {
              id: app.state.user.id,
              name: app.state.user.name,
            },
          })
          return
        }
      } catch (err) {
        console.error(err)
      }
    }
    Object.assign(this.state, {
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
                  __html: highlight(app.state.word)(htmlspecialchars(link.title)),
                }}
              />
            </div>
            <div className="meta">
              <img
                className="lazy favicon"
                data-src={link.favicon}
                src="/static/loading.gif"
                ref={dom => {
                  this.favicon = dom
                }}
              />
              <div className="url">{_getHostname(link.url)}</div>
              <div className="author-name">{link.author && ' | by ' + link.author.name}</div>
              <div className="updatedAt">{link.updatedAt && '| ' + moment(link.updatedAt).fromNow()}</div>
            </div>
            <div
              className="desc"
              dangerouslySetInnerHTML={{
                __html: highlight(app.state.word)(htmlspecialchars(link.desc)),
              }}
            />
            <div className="post-menu">
              {app.auth.isLogin(this.props.state) && (
                <PostButton
                  isChild={this.props.isChild}
                  link={link}
                  userId={this.props.state.user.id}
                  commentClick={() => this.commentClick()}
                  refClick={() => this.refClick()}
                />
              )}
            </div>
            {this.state.commentClicked && <CommentWrite linkID={link.id} commentClick={this.commentClick.bind(this)} />}
            {this.state.refClicked && <RefWrite linkID={link.id} refClick={this.refClick.bind(this)} />}
            <CommentList comments={link.comments} state={this.props.state} />
          </div>
          <div className="right">
            <img
              className="lazy"
              data-src={link.image}
              src="/static/loading.gif"
              ref={dom => {
                this.image = dom
              }}
            />
          </div>
        </div>
        {link.refLinks && <RefPostList refLinks={link.refLinks} state={this.props.state} />}
      </li>
    )
  }
}

decorate(Post, {
  state: observable,
  commentClick: action,
})

export default withLogger(Post)
