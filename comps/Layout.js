import Head from 'next/head';
import Header from './Header';
import { withRouter } from 'next/router'

import "./Layout.scss";
import app from '../src/app';


const Layout = (props) => {
  global.onSignIn = (googleUser) => {
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
    // console.log("ID Token: " + id_token);

    app.api.login(id_token).then(res => {
      app.user = res.user;
      app.user.token = id_token;

      app.state.userID = res.user.id;
    });


    let GoogleAuth = gapi.auth2.getAuthInstance();

    app.auth.signOut = () => {
      return GoogleAuth.signOut().then(() => {
        app.state.userID = "";
      });
    }

    // app.auth.signIn = () => {
    //     return GoogleAuth.signIn();
    // }

    props.router.push("/");
  };

  return (
    <div className="layoutStyle">
      <Head>
        <title>sharelink - 링크공유</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        
        <link rel="stylesheet" href="/static/css/fontello.css"></link>
        
        
        <meta name="google-signin-scope" content="profile email" />
        <meta name="google-signin-client_id" content="314955303656-ohiovevqbpms4pguh82fnde7tvo9cqnb.apps.googleusercontent.com" />
        <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
        

        <link rel='stylesheet' href='https://unpkg.com/nprogress@0.2.0/nprogress.css' />
        <script src='https://unpkg.com/nprogress@0.2.0/nprogress.js'></script>
      </Head>
      <div style={{ display: "none" }} className="g-signin2" data-onsuccess="onSignIn" />
      <Header/>
      {props.children}
    </div>
  )
}


export default withRouter(Layout)