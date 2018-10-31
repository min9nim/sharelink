import Link from 'next/link';
import "./Header.scss";
import app from "../src/app";


/**
 * 로고 이미지 출처: https://www.fontspace.com
 */
class Header extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showMenu: true
    }
    app.view.Header = this;
    if(global.document){
      global.document.onclick = (e) => {
        let clickMenu = [
          e.target.className,
          e.target.parentNode.className,
          e.target.parentNode.parentNode.className
        ].includes("menu");
  
        if(!clickMenu){
          this.setState({showMenu: false})
        }
      }
    }
    
  }

  menu(){
    this.setState({showMenu: true});
  }

  logout(){
    app.auth.signOut();
  }

  newLink(){
    if(app.auth.isLogin()){
      this.props.router.push("/write");
    }else{
      alert("먼저 로그인이 필요합니다");
      this.props.router.push("/login");
    }
  }

  render(){
    return (
      <div className="header">
        <div className="logo-wrapper">
          <div className="logo">
            <Link href="/"><img src="/static/logo.png"></img></Link>
          </div>
        </div>
        <div className="btn-wrapper">
            <div className="add-btn" onClick={this.newLink.bind(this)}>등록</div>
            {
            app.auth.isLogin()
            &&
            <React.Fragment>
              <img className="user-image" src={app.state.user.image}></img>
              <div className="user-name" onClick={this.menu.bind(this)}>{app.state.user.name} v</div>
            </React.Fragment>
            
            // <Link href="/login">
            //   <div className="login-btn">로그인</div>
            // </Link>
          }            
        </div>
        {
          this.state.showMenu &&
          <div className="menu">
            <div className="user-info">
              <img className="user-image" src={app.state.user.image}></img>
              <div className="user-name" onClick={this.menu.bind(this)}>{app.state.user.name}</div>
            </div>
            <div className="item">
              <div>내 포스트</div>
              <div>내가 좋아하는 포스트</div>
              <div>내가 읽었던 포스트</div>
              <div>나중에 읽을 포스트</div>
              <div>로그아웃</div>              
            </div>

          </div>          
        }

      </div>
    )
  }
}



export default Header