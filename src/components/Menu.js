import { withRouter } from 'next/router'
import app from '../biz/app'
import './Menu.scss'
import { menuOutClick } from './Menu-fn'

class Menu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menu: app.state.menu.slice(1),
    }

    app.view.Menu = this
  }

  logout = async () => {
    await app.auth.signOut()
    this.props.hideMenu()
  }

  componentDidMount() {
    document.onclick = menuOutClick(this.props.hideMenu)
  }
  componentWillUnmount() {
    document.onclick = null
  }

  selectMenu(idx) {
    return () => {
      app.state.links = []
      app.state.menuIdx = idx + 1
      app.state.totalCount = '?'

      this.props.router.push(app.state.menu[idx + 1].path)
      this.props.hideMenu()
    }
  }

  render() {
    return (
      <div className="menu">
        <div className="user-info">
          <img className="user-image" src={app.state.user.image}></img>
          <div className="user-name">{app.state.user.name}</div>
        </div>
        <div className="item">
          {this.state.menu.map((m, idx) => (
            <div key={idx} onClick={this.selectMenu(idx)}>
              {m.label}
            </div>
          ))}
        </div>
        <div className="item2">
          <div onClick={this.props.newLink}>등록하기</div>
          <div onClick={this.logout}>로그아웃</div>
        </div>
      </div>
    )
  }
}

export default withRouter(Menu)
