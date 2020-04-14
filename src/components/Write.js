import Layout from '../components/Layout.js'
import { withRouter } from 'next/router'
import app from '../biz/app'
import shortid from 'shortid'
import { _findLink, avoidXSS, withLogger } from '../biz'
import { webscrap } from '../biz/webscrap.js'
import { observable, reaction, decorate } from 'mobx'
import WriteTemplate from './WriteTemplate'

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
      () =>
        JSON.stringify({
          link: this.link,
          placeholder: this.placeholder,
        }),
      (state) => {
        this.props.logger.verbose('state 변화 감지 forceUpdate', state)
        this.forceUpdate()
      },
    )
  }

  componentDidMount() {
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
        <WriteTemplate parent={this} />
      </Layout>
    )
  }
}

export default withRouter(withLogger(Write))
