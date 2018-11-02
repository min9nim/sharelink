//import Link from 'next/link';
import "./Header.scss";
import app from "../src/app";
import Menu from "./Menu";


/**
 * 로고 이미지 출처: https://www.fontspace.com
 */
class Header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showMenu: false
    }
    app.view.Header = this;
  }

  showMenu(){
    this.setState({showMenu: true});
  }

  hideMenu(){
    this.setState({showMenu: false});
  }


  newLink(){
    if(app.auth.isLogin()){
      this.props.router.push("/write");
    }else{
      alert("로그인 페이지로 이동합니다");
      this.props.router.push("/login");
    }
  }

  logoClick(){
    this.props.router.push("/");
    app.api.fetchLinks();
  }

  componentDidMount() {
    this._ismounted = true;
  }


  componentWillUnmount() {
    this._ismounted = false;
  }

  render(){
    return (
      <div className="header">
        <div className="logo-wrapper">
          <div className="logo" onClick={this.logoClick.bind(this)}>
            <img src="/static/logo.png"></img>
          </div>
        </div>
        <div className="btn-wrapper">
            <div className="add-btn" onClick={this.newLink.bind(this)}><i className="icon-doc-new"/>등록</div>
            {
            app.auth.isLogin()
            &&
            <React.Fragment>
              <img className="user-image" src={app.user.image}></img>
              <div className="user-name" onClick={this.showMenu.bind(this)}>{app.user.name} <i className="icon-menu"/></div>
            </React.Fragment>
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



export default Header