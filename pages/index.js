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
      global.document.body.onscroll = onscroll;
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
          {app.state.links.map((link) => {
            return (
              <Post key={link.id} link={link} />
            )
          })}
          {this.state.loading && new Array(5).fill().map((v, i) => <LinkLoading key={i} />)}
        </ul>
      </Layout>
    )
  }
}


function onscroll() {
  // if (global.location.pathname !== "/") {
  //   // 목록화면이 아니면 리턴  
  //   return;
  // }

  const PAGEROWS = 10;

  // 현재 목록화면 scrollTop 의 값
  const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

  // 현재 스크롤 값을 전역변수에 저장
  app.scrollTop = scrollTop;


  if(app.isScrollLast) return;
  
  /**
   * 18.11.05
   * 추가 10개 로드전 다시한번 요청이 올라가는 문제를 막기위해 아래 조건 추가
   */
  if(app.view.List.state.loading) return;


  //현재문서의 높이
  const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  //현재 화면 높이 값
  const clientHeight = document.documentElement.clientHeight;

  //console.log("scrollTop : " + scrollTop)
  //console.log("clientHeight : " + clientHeight)
  //console.log("scrollHeight : " + scrollHeight)


  if (
      (scrollTop + clientHeight == scrollHeight)    // 일반적인 경우(데스크탑: 크롬/파폭, 아이폰: 사파리)
      ||
      (app.isMobileChrome() && (scrollTop + clientHeight == scrollHeight - 56))   // 모바일 크롬(55는 위에 statusbar 의 높이 때문인건가)
  ){ //스크롤이 마지막일때

      app.api.fetchLinks({
          idx: app.state.links.length,
          cnt: PAGEROWS,
      })
      .then(links => {
          if(links.length < PAGEROWS){
              console.log("Scroll has touched bottom")
              app.isScrollLast = true;
              return;
          }
      })
  }



};