import Layout from '../comps/Layout.js';
import Post from '../comps/Post.js';
import LinkLoading from '../comps/LinkLoading.js';

import app from "../src/app";
import "./index.scss";

export default class List extends React.Component {
  constructor(props) {
    console.log("List 생성자 호출")
    super(props);
    this.state = {
      loading: true,
      intro: "전체 포스트"
    }
    app.view.List = this;

    app.api.fetchLinks();
  }


  componentDidMount() {
    this._ismounted = true;
    
    /**
     * 18.11.02
     * delay를 줘도 스크롤 위치 보정이 잘 안된다;
     */
    console.log("이동할 스크롤 위치 값 = " + app.scrollTop);
    setTimeout(function(){
      app.$m.scrollTo(0, app.scrollTop);        // 이전 스크롤 위치로 복원
      console.log("이동 후스크롤 위치 값 = " + app.scrollTop);
    }, 1000);

    if (global.document) {
      global.document.body.onscroll = function () {
        if (global.location.pathname !== "/") {
          // 목록화면이 아니면 리턴  
          return;
        }
    
        // 현재 목록화면 scrollTop 의 값
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    
        // 현재 스크롤 값을 전역변수에 저장
        app.scrollTop = scrollTop;
      };
    }
  }


  componentWillUnmount() {
    this._ismounted = false;
    console.log("저장된 스크롤 값 = " + app.scrollTop)
    global.document.body.onscroll = undefined;
  }

  render() {
    return (
      <Layout>
        {
          this.state.intro &&
          <div className="intro">{"* " + this.state.intro + "(" + app.state.links.length + "개)"}</div>
        }
        
        <ul>
          {app.state.links.map((link) => (
            <Post key={link.id} link={link} />
          ))}
          {this.state.loading && new Array(5).fill().map((v, i) => <LinkLoading key={i} />)}
        </ul>
      </Layout>
    )
  }
}
