import Head from 'next/head';
import Header from './Header';
import { withRouter } from 'next/router'

import "./Layout.scss";
import app from '../src/app';

let layoutProps;
const Layout = (props) => {
  console.log("Layout 렌더링..");

  layoutProps = props;
  app.router = props.router;

  let googleLoginBtn;
  
  googleLoginBtn = <div style={{ display: "none" }} className="g-signin2" data-onsuccess="onSignIn" />


  return (
    <div className="layoutStyle">
      <Head>
        <title>sharelink - 링크공유</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta name="google-signin-scope" content="profile email" />
        <meta name="google-signin-client_id" content="314955303656-ohiovevqbpms4pguh82fnde7tvo9cqnb.apps.googleusercontent.com" />
        <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>

        <link rel='stylesheet' href='https://unpkg.com/nprogress@0.2.0/nprogress.css' />
        <script src='https://unpkg.com/nprogress@0.2.0/nprogress.js'></script>

        <link rel="stylesheet" href="/static/css/style.css"></link>
        <link rel="stylesheet" href="/static/css/fontello.css"></link>
      </Head>
      <div>
        <Header />
      </div>
      {
        googleLoginBtn
      }
      {props.children}
    </div>
  )
}


global.onSignIn = (googleUser) => {
  console.log("global.onSignIn 호출");

  let GoogleAuth = gapi.auth2.getAuthInstance();

  app.auth.signOut = () => {
    app.state.userID = "";

    return GoogleAuth.signOut().then(() => {
      console.log("GoogleAuth.signOut() 완료 후 콜백");
      app.state.userID = "";
    });
  }


  if (app.auth.isLogin()) {
    return;
  }
  var profile = googleUser.getBasicProfile();
  // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  // console.log('Full Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  //console.log("@@@@ token 세팅 하고 login 호출할꺼임")
  app.user.token = id_token;

  console.log(id_token);

  // console.log("ID Token: " + id_token);

  app.api.login(id_token).then(res => {
    if(res.status === "Fail"){
      console.log("Invalid token");
    }else{
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