import Layout from '../comps/Layout.js';
import { withRouter } from 'next/router'
import app from "../src/app";
import { observable, reaction, decorate } from "mobx";
import shortid from "shortid";
import Link from 'next/link';


class Write extends React.Component {
  constructor(props){
    super(props);

    let link = app.state.links.find(l => l.id === props.router.query.id);
    link = Object.assign({}, link);   // 복사본을 전달
    
    this.state = link || {
      id: "",
      url : "",
      title : "",
      desc : ""
    };

    console.log("runtime env = " + this.props.from);
    
    // 변이를 추적할 상태 지정
    decorate(this, {state: observable});

    // 변화에 따른 효과를 정의
    reaction(() => JSON.stringify(this.state), () => {
      this.forceUpdate();
    });
  }

  static async getInitialProps ({req}) {
    console.log("@@ 여기는 서버에서만 수행되는 로직");
    return req 
        ? { from: 'server' } // 서버에서 실행 할 시
        : { from: 'client '} // 클라이언트에서 실행 할 시
  }


  save(){
    if(this.state.id){
      var asis = app.state.links.find(l => l.id === this.state.id);
      Object.assign(asis, this.state);
    }else{
      app.state.links.push(Object.assign({}, this.state, {id : shortid.generate()}));
    }
  }


  handleChange(e){
    this.state[e.target.id] = e.target.value;
  }
  
  
  render(){
    return (
      <Layout>
      <h2>포스트 등록</h2>
      <div className="form">
        <div>
          <input placeholder="http://" id="url" value={this.state.url} onChange={this.handleChange.bind(this)}/>
        </div>
        <div>
          <input placeholder="제목" id="title" value={this.state.title} onChange={this.handleChange.bind(this)}/>
        </div>
        <div>
          <input placeholder="간단 설명(선택)" id="desc" value={this.state.desc} onChange={this.handleChange.bind(this)}/>
        </div>
      </div>
      <div className="btn">
        <Link href="/"><button onClick={this.save.bind(this)}>저장하기</button></Link>
        <Link href="/"><button>취소</button></Link>
      </div>
      <style jsx global>{`
      .form > div {
        margin: 10px 0px;
      }
      input {
        width: 100%;
        max-width: 400px;
        height: 30px;
      }

      .btn > button {
        margin: 0px 5px;
        cursor: pointer;
      }
    `}</style>
    </Layout>
    )
  }
}

export default withRouter(Write)