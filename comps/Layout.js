import Head from 'next/head';
import Header from './Header';
import { withRouter } from 'next/router'

import "./Layout.scss";
import app from '../src/app';

let layoutProps;
const Layout = (props) => {
  // console.log("Layout 렌더링..");

  // layoutProps = props;
  app.router = props.router;

  if(global.location && app.router.asPath !== "/login"){
    setTimeout(() => {
      if (gapi.auth2.getAuthInstance() === null) {
        // 구글 로그인 초기화
        gapi.client.init({
          'apiKey': 'sharelink',
          'clientId': '314955303656-ohiovevqbpms4pguh82fnde7tvo9cqnb.apps.googleusercontent.com',
          'scope': 'https://www.googleapis.com/auth/drive.metadata.readonly',
        })
      }
    }, 1000)
  }  


  return (
    <div className="layoutStyle">
      <Head>
        <title>sharelink - 링크공유</title>
      </Head>
      <div>
        <Header />
      </div>
      {/* {
        props.router.pathname !== "/login" &&
        <div style={{ display: "none" }} className="g-signin2" data-onsuccess="onSignIn" />
      } */}
      {props.children}
    </div>
  )
}

export default withRouter(Layout)