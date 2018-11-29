import Head from 'next/head';
import Header from './Header';
import { withRouter } from 'next/router'

import "./Layout.scss";
import app from '../src/app';

let layoutProps;
const Layout = (props) => {
  // console.log("Layout 렌더링..");

  layoutProps = props;
  app.router = props.router;


  return (
    <div className="layoutStyle">
      <Head>
        <title>sharelink - 링크공유</title>
      </Head>
      <div>
        <Header />
      </div>
      {
        props.router.pathname !== "/login" &&
        <div style={{ display: "none" }} className="g-signin2" data-onsuccess="onSignIn" />
      }
      {props.children}
    </div>
  )
}


global.onSignIn = (googleUser) => {
  console.log("global.onSignIn 호출");

  let GoogleAuth = gapi.auth2.getAuthInstance();

  app.auth.signOut = () => {

    // 애플리케이션 로그아웃처리
    document.cookie = "user="
    global.sessionStorage.setItem("user", "");
    app.user = {
        id: "",
        name: "",
        email: "",
        image: "",
        token: ""
    };
    app.state.userID = "";

    // 구글 로그아웃처리
    return GoogleAuth.signOut().then(() => {
      console.log("GoogleAuth.signOut() 완료 후 콜백");
      //app.state.userID = "";
    });
  }

  /**
   * 18.11.21
   * 아래 예외처리를 위의 signOut 함수 세팅하는 것보다 위에서 하면
   * 로그아웃이 정상동작 않게 된다
   */
  if (app.auth.isLogin()) {
    return;
  }


  let profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  // console.log('Full Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  let id_token = googleUser.getAuthResponse().id_token;
  //console.log("@@@@ token 세팅 하고 login 호출할꺼임")
  app.user.token = id_token;

  // console.log(id_token);

  // console.log("ID Token: " + id_token);

  app.api.login(id_token).then(res => {
    if (res.status === "Fail") {
      console.log("Invalid token");
    } else {
      app.user = res.user;
      app.user.token = id_token;
      app.state.userID = res.user.id;
      //document.cookie = "token=" + id_token;
      let enc = app.Base64Encode(JSON.stringify(app.user))
      document.cookie = `user=${enc}`;
      sessionStorage.setItem("user", JSON.stringify(app.user));
      layoutProps.router.push("/");
    }
  });

};

export default withRouter(Layout)