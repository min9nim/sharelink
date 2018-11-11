//import Link from 'next/link';
import "./Header.scss";
import app from "../src/app";
import Menu from "./Menu";
import Search from "./Search";

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
    app.state.menuIdx = 0;
    app.state.word = "";
    this.props.router.push("/");
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

  newLink = () => {
    app.view.Write && app.view.Write._ismounted && Object.assign(app.view.Write.state, {
      id: "",
      url: "",
      title: "",
      desc: "",
      image: "",
      like: [],
      read: [],
      toread: [],
      author: {
        id: app.user.id,
        name: app.user.name
      }
    });
    this.hideMenu();
    this.props.router.push("/write");
  }


  render() {
    // console.log("Header 렌더링..")
    return (
      <div className="header">
        <div className="logo-wrapper">
          <div className="logo">
            <div className="logo-font" onClick={this.logoClick.bind(this)}>sharelink</div>
            {/* <img src="/static/logo.png" onClick={this.logoClick.bind(this)}></img> */}
          </div>
        </div>
        <div className="search">
        {
          this.props.router.pathname === "/" &&
          <Search />
        }
        </div>
        <div className="btn-wrapper">
          {
            app.auth.isLogin()
              ?
              // "프로필사진+이름"
              <React.Fragment>
                <div className="add-btn" onClick={this.newLink.bind(this)}>+</div>
                <img className="user-image" src={app.user.image}></img>
                <div className="user-name" onClick={this.showMenu.bind(this)}>
                  {
                    /**
                     * 18.11.10
                     * 모바일에서 이름이 출력되면 왼쪽에 글등록버튼의 UI가 깨지는 문제 때문에 그냥 출력안하는 것으로 보정함
                     */
                    app.isDesktop() && app.user.name}<i className="icon-menu" />
                </div>
              </React.Fragment>
              :
              <div className="login-btn" onClick={this.goLogin.bind(this)}><i className="icon-login" />로그인</div>
            // "로그인버튼"
          }
        </div>
        {
          this.state.showMenu &&
          <Menu hideMenu={this.hideMenu.bind(this)} newLink={this.newLink} />
        }
      </div>
    )
  }
}



export default withRouter(Header)