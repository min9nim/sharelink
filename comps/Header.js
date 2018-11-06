//import Link from 'next/link';
import "./Header.scss";
import app from "../src/app";
import Menu from "./Menu";
import { withRouter } from 'next/router'



/**
 * 로고 이미지 출처: https://www.fontspace.com
 */
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false
    }
    app.view.Header = this;
  }

  showMenu() {
    this.setState({ showMenu: true });
  }

  hideMenu() {
    this.setState({ showMenu: false });
  }


  logoClick() {
    this.props.router.push("/");
    //app.view.List.state.intro = "전체 포스트"
    app.state.menuIdx = 0;
    app.api.fetchList(app.state.menu[app.state.menuIdx].path);
  }

  goLogin() {
    this.props.router.push("/login");
  }

  componentDidMount() {
    this._ismounted = true;
  }


  componentWillUnmount() {
    this._ismounted = false;
  }

  render() {
    return (
      <div className="header">
        <div className="logo-wrapper">
          <div className="logo">
            <img src="/static/logo.png" onClick={this.logoClick.bind(this)}></img>
          </div>
        </div>
        <div className="btn-wrapper">
          {
            app.auth.isLogin()
              ?
              <React.Fragment>
                <img className="user-image" src={app.user.image}></img>
                <div className="user-name" onClick={this.showMenu.bind(this)}>{app.user.name} <i className="icon-menu" /></div>
              </React.Fragment>
              :
              <div className="add-btn" onClick={this.goLogin.bind(this)}><i className="icon-login" />로그인</div>
          }
        </div>
        {
          this.state.showMenu &&
          <Menu hideMenu={this.hideMenu.bind(this)}/>
        }
      </div>
    )
  }
}



export default withRouter(Header)