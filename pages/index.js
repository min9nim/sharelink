import Layout from '../comps/Layout.js';
import Post from '../comps/Post.js';
import LinkLoading from '../comps/LinkLoading.js';

import app from "../src/app";
import "./index.scss";

export default class List extends React.Component {
  constructor(props){
    super(props);
    app.view.List = this;
    this.state = {
      loading: false
    }

    this.state.loading = true;
    app.api.fetchLinks().then(() => this.setState({loading: false}));
  }


  componentDidMount(){
    app.$m.scrollTo(0, app.scrollTop);        // 이전 스크롤 위치로 복원
  }


  render() {
    return (
      <Layout>
      <ul>
        {app.state.links.slice().reverse().map((link) => (
          <Post key={link.id} link={link}/>
        ))}
        {this.state.loading && new Array(5).fill().map((v,i) => <LinkLoading key={i}/>)}
      </ul>
    </Layout>
    )
  }
}


if(global.document){
  global.document.body.onscroll = function () {
    //const PAGEROWS = 10;
    
    if(global.location.pathname !== "/"){
        // 목록화면이 아니면 리턴  
        return;
    }
  
    // 현재 목록화면 scrollTop 의 값
    const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  
    // 현재 스크롤 값을 전역변수에 저장
    app.scrollTop = scrollTop;
    
  };

}
