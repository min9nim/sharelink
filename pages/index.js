import Layout from '../comps/Layout.js';
import Post from '../comps/Post.js';
import LinkLoading from '../comps/LinkLoading.js';

import app from "../src/app";
import "./index.scss";

export default class List extends React.Component {
  constructor(props) {
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
    app.$m.scrollTo(0, app.scrollTop);        // 이전 스크롤 위치로 복원

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
