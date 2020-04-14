import Layout from '../components/Layout.js'
import { withRouter } from 'next/router'
//import Head from 'next/head';
import app from '../biz/app'
import './login.scss'
import createLogger from 'if-logger'

const Login = ({ router, user }) => {
  app.state.user = user

  return (
    <Layout state={app.state}>
      <div className="login-wrapper">
        <div className="login-title">구글 로그인만 지원됩니다</div>
        <div className="login-btn">
          <div className="g-signin2" data-onsuccess="onSignIn"></div>
        </div>
      </div>
    </Layout>
  )
}

Login.getInitialProps = async ({ req }) => {
  let user = await app.getUser(req)
  return {
    user,
  }
}

global.onSignIn = async (googleUser) => {
  const logger = createLogger({ tags: ['onSignIn'] })
  console.log('global.onSignIn 호출')

  /**
   * 18.11.21
   * 아래 예외처리를 위의 signOut 함수 세팅하는 것보다 위에서 하면
   * 로그아웃이 정상동작 않게 된다
   */
  if (app.auth.isLogin()) {
    app.router.push('/')
    return
  }

  let profile = googleUser.getBasicProfile()
  // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  // console.log('Full Name: ' + profile.getName());
  // console.log('Given Name: ' + profile.getGivenName());
  // console.log('Family Name: ' + profile.getFamilyName());
  // console.log("Image URL: " + profile.getImageUrl());
  // console.log("Email: " + profile.getEmail());

  // The ID token you need to pass to your backend:
  let id_token = googleUser.getAuthResponse().id_token
  //console.log("@@@@ token 세팅 하고 login 호출할꺼임")
  // app.state.user.token = id_token

  // console.log(id_token);

  // console.log("ID Token: " + id_token);

  const res = await app.api.login(id_token)
  if (res.status === 'Fail') {
    throw Error('invalid token')
  }
  global.GoogleAuth = global.gapi.auth2.getAuthInstance()
  app.auth.setLogin(res.user, id_token)
  app.router.push('/')
}

export default withRouter(Login)
