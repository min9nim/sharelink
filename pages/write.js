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
      image: "",
      like: [],
      read: [],
      toread: [],
      author: {
        id: app.user.id,
        name: app.user.name
      }
    };


    console.log("runtime env = " + this.props.from);

    // mobx 설정
    decorate(this, { state: observable });
    reaction(() => JSON.stringify(this.state), () => {
      this.forceUpdate();
    });
  }

  static async getInitialProps({ req }) {
    // console.log("@@ 여기는 서버에서만 수행되는 로직");
    return req
      ? { from: 'server' } // 서버에서 실행 할 시
      : { from: 'client ' } // 클라이언트에서 실행 할 시
  }

  cancel(){
    this.props.router.push("/")
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




    // 인증을 위한 토큰 전달
    this.state.token = app.user.token;

    if (this.state.id) {
      // 수정할 때
      await app.api.putLink(this.state);
    } else {
      // 신규등록
      let newLink = Object.assign({}, this.state, { id: shortid.generate() });
      await app.api.postLink(newLink);
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

  async handleBlur() {
    if (this.state.url === "") return;
    if (this.state.title !== "") return;

    const loadingMessage = "Loading.."

    // this.state.title = loadingMessage;
    // this.state.desc = loadingMessage;
    // this.state.image = loadingMessage;

    this.titleInput.setAttribute("placeholder", loadingMessage);
    this.descInput.setAttribute("placeholder", loadingMessage);
    this.imageInput.setAttribute("placeholder", loadingMessage);

    try {
      let { title, image, desc } = await app.api.webscrap(this.state.url);

      // 타이틀 세팅
      this.state.title = title;

      //이미지 세팅
      if (image && image.indexOf("http") === 0) {
        // http 로 시작하면 그냥 사용
        this.state.image = image;
      } else {
        let url = new URL(this.state.url);
        this.state.image = url.protocol + "//" + url.hostname + image;
        //console.log(this.state.image);
      }

      if (this.state.title === "") {
        this.titleInput.setAttribute("placeholder", "글 제목을 가져올 수 없습니다")
      }
      if (this.state.desc === "") {
        this.descInput.setAttribute("placeholder", "글 설명을 가져올 수 없습니다")
      }
      if (this.state.image === "") {
        this.imageInput.setAttribute("placeholder", "대표 이미지가 없습니다")
      }




      // 설명세팅
      this.state.desc = desc;
    } catch (e) {
      console.error(e.message);
    }

  }

  render() {
    return (
      <Layout>
        <div className="write-title">{this.state.id ? "내용 수정" : "링크 등록"}</div>
        <div className="wrapper">
          <div className="form">
            <div>
              <div className="label">글주소</div>
              <input placeholder="http://" id="url" ref={el => { this.urlInput = el; }} value={this.state.url} onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)} />
            </div>
            <div>
              <div className="label">글제목</div>
              <input placeholder="" id="title" ref={el => { this.titleInput = el; }} value={this.state.title} onChange={this.handleChange.bind(this)} />
            </div>
            <div>
              <div className="label">간단 설명(선택)</div>
              <input placeholder="" id="desc" ref={el => { this.descInput = el; }} value={this.state.desc} onChange={this.handleChange.bind(this)} />
            </div>
            <div>
              <div className="label">대표 이미지 경로</div>
              <input placeholder="" id="image" ref={el => { this.imageInput = el; }} value={this.state.image} onChange={this.handleChange.bind(this)} />
            </div>
          </div>
          <div className="image">
            <img src={this.state.image}></img>
          </div>
        </div>

        <div className="btn">
          <div onClick={this.save.bind(this)}><i className="icon-floppy"/> 저장</div>
          <div onClick={this.cancel.bind(this)}><i className="icon-cancel"/> 취소</div>
        </div>
      </Layout>
    )
  }
}

export default withRouter(Write)