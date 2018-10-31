import Head from 'next/head';
import Header from './Header';
import "./Layout.scss";
import app from '../src/app';


const Layout = (props) => (
  <div className="layoutStyle">
    <Head>
      <title>sharelink - 링크공유</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="google-signin-scope" content="profile email" />
      <meta name="google-signin-client_id" content="557495610346-0d8b5e9vlnh9abpdn7rheamuck4982cg.apps.googleusercontent.com" />
      <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>
    </Head>
    <Header />
    {props.children}
  </div>
)


global.init = () => {
  gapi.load('auth2', function () {
    let auth2 = gapi.auth2.init({
      client_id: '557495610346-0d8b5e9vlnh9abpdn7rheamuck4982cg.apps.googleusercontent.com',
      fetch_basic_profile: false,
      scope: 'profile'
    });

    app.auth.GoogleAuth = auth2;
    
    app.auth.signOut = () => {
      return auth2.signOut();
    }
    app.auth.signIn = () => {
      return auth2.signIn();
    }


    if (auth2.isSignedIn.get()) {
      app.auth.onSiginIn(auth2);
    } else {
      console.log("로그인이 필요합니다..")
    }
  });
}


/*
    // Sign the user in, and then retrieve their ID.
    auth2.signIn().then(function() {
      console.log(auth2.currentUser.get().getId());
    });

*/

export default Layout