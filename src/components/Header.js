//import Link from 'next/link';
import './Header.scss'
import app from '../biz/app'
import Menu from './Menu'
import Search from './Search'
import { withRouter } from 'next/router'
import { withLogger } from '../biz'

/**
 * 로고 이미지 출처: https://www.fontspace.com
 */
class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
    }
    app.view.Header = this
  }

  showMenu() {
    this.setState({ showMenu: true })
  }

  hideMenu() {
    this.setState({ showMenu: false })
  }

  logoClick() {
    app.state.menuIdx = 0
    app.state.word = ''
    app.state.hasNext = true
    app.state.searched = false
    app.state.links = []
    this.props.router.push('/')
  }

  goLogin() {
    //this.props.router.push("/login");
    /**
     * 18.11.11
     * 화면을 뒤집으면서 이동해야 로그인버튼이 나타난다
     */
    location.href = '/login'
  }

  componentDidMount() {
    this._ismounted = true
  }

  componentWillUnmount() {
    this._ismounted = false
  }

  newLink = () => {
    app.view.Write?._ismounted &&
      Object.assign(app.view.Write.state, {
        id: '',
        url: '',
        title: '',
        desc: '',
        image: '',
        like: [],
        read: [],
        toread: [],
        author: {
          id: app.state.user.id,
          name: app.state.user.name,
        },
      })
    this.hideMenu()
    this.props.router.push('/write')
  }

  render() {
    this.props.logger.verbose('render')
    const { image, name } = this.props.state.user
    return (
      <div className="header">
        <div className="logo-wrapper">
          <div className="logo">
            <div className="logo-font" onClick={this.logoClick.bind(this)}>
              sharelink
            </div>
          </div>
        </div>
        <div className="search">
          {this.props.router.pathname === '/' && <Search />}
        </div>
        <div className="btn-wrapper">
          {app.auth.isLogin(this.props.state) ? (
            <>
              {/* <div className="add-btn" onClick={this.newLink.bind(this)}>+</div> */}
              <img className="user-image" src={image} />
              <div className="user-name" onClick={this.showMenu.bind(this)}>
                <div>{name}</div>
                <i className="icon-menu" />
              </div>
            </>
          ) : (
            <div className="login-btn" onClick={this.goLogin.bind(this)}>
              <i className="icon-login" />
              로그인
            </div>
          )}
        </div>
        {this.state.showMenu && (
          <Menu hideMenu={this.hideMenu.bind(this)} newLink={this.newLink} />
        )}
      </div>
    )
  }
}

export default withRouter(withLogger(Header))
