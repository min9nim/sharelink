import Layout from '../comps/Layout.js';
import { withRouter } from 'next/router'
import app from "../src/app";
import { observable, reaction, decorate } from "mobx";
import shortid from "shortid";
import Link from 'next/link';
import URL from "url-parse";

import "./write.scss";


class Write extends React.Component {
  constructor(props) {
    super(props);

    let link = app.state.links.find(l => l.id === props.router.query.id);
    link = Object.assign({}, link);   // 복사본을 전달

    this.state = link.id ? link : {
      id: "",
      url: "",
      title: "",
      desc: "",
      image: ""
    };

    console.log("runtime env = " + this.props.from);

    // mobx 설정
    decorate(this, { state: observable });
    reaction(() => JSON.stringify(this.state), () => {
      this.forceUpdate();
    });
  }

  static async getInitialProps({ req }) {
    console.log("@@ 여기는 서버에서만 수행되는 로직");
    return req
      ? { from: 'server' } // 서버에서 실행 할 시
      : { from: 'client ' } // 클라이언트에서 실행 할 시
  }


  async save() {
    if (!this.state.url) {
      alert("링크를 입력해 주세요");
      this.urlInput.focus();
      return;
    }
    if (!this.state.title) {
      alert("제목을 입력해 주세요");
      this.titleInput.focus();
      return;
    }


    if (this.state.id) {
      var asisIdx = app.state.links.findIndex(l => l.id === this.state.id);
      await app.api.putLink(this.state);
      app.state.links.splice(asisIdx, 1, this.state);
    } else {
      let newLink = Object.assign({}, this.state, { id: shortid.generate() });
      await app.api.postLink(newLink);
      app.state.links.push(newLink);
    }

    this.props.router.push("/");
  }

  componentDidMount() {
    this.urlInput.focus();
  }

  handleChange(e) {
    this.state[e.target.id] = e.target.value;
    // let o = {};
    // o[e.target.id] = e.target.value;
    // this.setState(o);
  }

  async handleFocus() {
    if (this.state.url === "") return;
    if (this.state.title !== "") return;
    
    this.state.title = "글 제목을 가져오는 중 입니다";
    this.state.desc = "글 내용을 가져오는 중입니다";

    try{
      let {title, image, desc} = await app.api.getTitle(this.state.url);
    
      // 타이틀 세팅
      this.state.title = title;
    
      //이미지 세팅
      if(image.indexOf("http") === 0){
        // http 로 시작하면 그냥 사용
        this.state.image = image;
      }else{
        let url = new URL(this.state.url);
        this.state.image = url.protocol + "//" + url.hostname + image;
        //console.log(this.state.image);
      }
  
      // 설명세팅
      this.state.desc = desc;      
    }catch(e){
      console.error(e.message);

      this.state.title = "글 제목을 가져올 수 없습니다";
      this.state.desc = "글 내용을 가져올 수 없습니다";
    }

  }

  render() {
    return (
      <Layout>
        <div className="write-title">포스트를 등록해 주세요</div>
        <div className="wrapper">
          <div className="form">
            <div>
              <input placeholder="http://" id="url" ref={el => { this.urlInput = el; }} value={this.state.url} onChange={this.handleChange.bind(this)} />
            </div>
            <div>
              <input placeholder="제목" id="title" ref={el => { this.titleInput = el; }} value={this.state.title} onChange={this.handleChange.bind(this)} onFocus={this.handleFocus.bind(this)} />
            </div>
            <div>
              <input placeholder="간단 설명(선택)" id="desc" value={this.state.desc} onChange={this.handleChange.bind(this)} />
            </div>
          </div>
          <div className="image">
            <img src={this.state.image}></img>
          </div>
        </div>
        
        <div className="btn">
          <button onClick={this.save.bind(this)}>저장하기</button>
          <Link href="/"><button>취소</button></Link>
        </div>
      </Layout>
    )
  }
}

export default withRouter(Write)