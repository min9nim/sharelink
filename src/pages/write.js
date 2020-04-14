import Layout from '../components/Layout.js'
import { withRouter } from 'next/router'
import app from '../biz/app'
import shortid from 'shortid'
import './write.scss'
import { _findLink, avoidXSS, withLogger } from '../biz'
import { getQueryParams, go } from 'mingutils'
import { prop } from 'ramda'
import { webscrap } from '../biz/webscrap.js'
import { observable, reaction, decorate } from 'mobx'

class Write extends React.Component {
  constructor(props) {
    super(props)

    props.logger.verbose('props.user.id', props.user.id)
    app.state.user = props.user

    const link = { ...this.props.link }

    this.link = link.id
      ? link
      : {
          id: '',
          url: '',
          title: '',
          desc: '',
          image: '',
          favicon: '',
          like: [],
          read: [],
          toread: [],
          author: {
            id: app.state.user.id,
            name: app.state.user.name,
          },
        }
    this.placeholder = {
      url: 'https://',
      title: '',
      desc: '',
      image: '',
      favicon: '',
    }

    // 변이를 추적할 상태 지정
    decorate(this, { link: observable, placeholder: observable })

    // 변화에 따른 효과를 정의
    reaction(
      () => {
        const res = JSON.stringify(
          { link: this.link, placeholder: this.placeholder },
          null,
          2,
        )
        // this.props.logger.verbose(res)
        return res
      },
      (state) => {
        this.props.logger.verbose('state 변화 감지 forceUpdate', state)
        this.forceUpdate()
      },
    )
  }

  componentDidMount() {
    global.write = this
    if (this.link.url === '') {
      this.urlInput.focus()
    }

    this.props.logger.verbose('app.state.user', app.state.user)
    if (!app.auth.isLogin()) {
      alert('글등록은 로그인이 필요합니다')
      //this.props.router.push("/login");
      location.href = '/login'
    }
  }

  cancel() {
    this.props.router.push('/')
  }

  async save() {
    if (!this.link.url) {
      alert('링크를 입력해 주세요')
      this.urlInput.focus()
      return
    }
    if (!this.link.title) {
      alert('제목을 입력해 주세요')
      this.titleInput.focus()
      return
    }

    if (this.link.id) {
      // 수정할 때
      await app.api.putLink(avoidXSS(this.link))
    } else {
      // 신규등록
      await app.api.postLink(avoidXSS({ ...this.link, id: shortid.generate() }))
    }

    this.props.router.push('/')
  }

  async handleBlur() {
    const { url, title, desc, image, favicon } = this.link

    if (!url) return
    if (title && desc && image && favicon) return

    const loadingMessage = 'Loading..'

    Object.assign(this.placeholder, {
      title: loadingMessage,
      desc: loadingMessage,
      image: loadingMessage,
      favicon: loadingMessage,
    })
    try {
      this.props.logger.verbose('handleBlur')
      const { title, image, desc, favicon } = await webscrap(this.link.url)
      const newState = {
        title: this.link.title || title,
        desc: this.link.desc || desc,
        image,
        favicon,
      }

      const newPlaceholder = {
        title: newState.title ? '' : '링크 제목을 가져올 수 없습니다',
        desc: newState.desc ? '' : '링크 제목을 가져올 수 없습니다',
        image: newState.image ? '' : '대표 이미지가 없습니다',
        favicon: newState.favicon ? '' : '파비콘 이미지가 없습니다',
      }

      Object.assign(this.link, newState)
      Object.assign(this.placeholder, newPlaceholder)
    } catch (e) {
      Object.assign(this.placeholder, {
        url: 'https://',
        title: '',
        desc: '',
        image: '',
        favicon: '',
      })

      this.props.logger.error(e.message)
    }
  }

  enterSave(e) {
    if (e.key === 'Enter') {
      this.save()
    }
  }

  enterCancel(e) {
    if (e.key === 'Enter') {
      this.cancel()
    }
  }

  render() {
    this.props.logger.verbose('render')
    return (
      <Layout state={app.state}>
        <div className="write-title">
          {this.link.id ? '내용 수정' : '링크 등록'}
        </div>
        <div className="wrapper">
          <div className="form">
            <div>
              <div className="label">글주소</div>
              <input
                placeholder={this.placeholder.url}
                id="url"
                ref={(el) => {
                  this.urlInput = el
                }}
                value={this.link.url}
                onChange={(e) => {
                  this.link.url = e.target.value
                }}
                onBlur={this.handleBlur.bind(this)}
              />
              <div className="init-btn">
                <i
                  className="icon-cancel"
                  onClick={(e) => {
                    this.link.url = ''
                  }}
                />
              </div>
            </div>
            <div>
              <div className="label">글제목</div>
              <input
                placeholder={this.placeholder.title}
                id="title"
                ref={(el) => {
                  this.titleInput = el
                }}
                value={this.link.title}
                onChange={(e) => {
                  this.link.title = e.target.value
                }}
              />
              <div className="init-btn">
                <i
                  className="icon-cancel"
                  onClick={() => {
                    this.link.title = ''
                  }}
                />
              </div>
            </div>
            <div>
              <div className="label">간단 설명(선택)</div>
              <input
                placeholder={this.placeholder.desc}
                id="desc"
                ref={(el) => {
                  this.descInput = el
                }}
                value={this.link.desc}
                onChange={(e) => {
                  this.link.desc = e.target.value
                }}
              />
              <div className="init-btn">
                <i
                  className="icon-cancel"
                  onClick={() => {
                    this.link.desc = ''
                  }}
                />
              </div>
            </div>
            <div>
              <div className="label">대표 이미지 경로</div>
              <input
                placeholder={this.placeholder.image}
                id="image"
                ref={(el) => {
                  this.imageInput = el
                }}
                value={this.link.image}
                onChange={(e) => {
                  this.link.image = e.target.value
                }}
              />
              <div className="init-btn">
                <i
                  className="icon-cancel"
                  onClick={() => {
                    this.link.image = ''
                  }}
                />
              </div>
            </div>
            <div>
              <div className="label">
                파비콘
                <img className="favicon" src={this.link.favicon} />
              </div>
              <input
                placeholder={this.placeholder.favicon}
                id="favicon"
                ref={(el) => {
                  this.faviconInput = el
                }}
                value={this.link.favicon}
                onChange={(e) => {
                  this.link.favicon = e.target.value
                }}
              />
              <div className="init-btn">
                <i
                  className="icon-cancel"
                  onClick={() => {
                    this.link.favicon = ''
                  }}
                />
              </div>
            </div>
          </div>
          <div className="image">
            <img src={this.link.image}></img>
          </div>
        </div>

        <div className="btn">
          <div
            onClick={this.save.bind(this)}
            tabIndex="0"
            onKeyPress={this.enterSave.bind(this)}
          >
            <i className="icon-floppy" /> 저장
          </div>
          <div
            onClick={this.cancel.bind(this)}
            tabIndex="0"
            onKeyPress={this.enterCancel.bind(this)}
          >
            <i className="icon-cancel" /> 취소
          </div>
        </div>
      </Layout>
    )
  }
  static async getInitialProps({ req, asPath, query }) {
    const logger = global.logger.addTags('getInitialProps')
    let user = await app.getUser(req)
    logger.verbose('user:', user)
    app.state.user = user

    let link
    if (req) {
      const fetchRes = await go(
        req.url,
        getQueryParams,
        prop('id'),
        app.api.fetchLink,
      )
      link = fetchRes[0]
    } else {
      //link = app.state.links.find(l => l.id === query.id);
      link = _findLink(app.state.links, query.id)
    }

    return {
      menuIdx: 0,
      link,
      user,
    }
  }
}

export default withRouter(withLogger(Write))
