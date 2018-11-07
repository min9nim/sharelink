import Layout from '../comps/Layout.js';
import { withRouter } from 'next/router'
//import Head from 'next/head';
import app from "../src/app";
import "./login.scss";


const Login = ({ router, user }) => {
    app.user = user;

    return (
        <Layout>
            {/* <Head>
                <meta name="google-signin-scope" content="profile email" />
                <meta name="google-signin-client_id" content="557495610346-0d8b5e9vlnh9abpdn7rheamuck4982cg.apps.googleusercontent.com" />
                <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script>

            </Head> */}
            <div className="login-wrapper">
                <div className="login-title">
                    구글 로그인만 지원됩니다
                </div>
                <div className="login-btn">
                    <div className="g-signin2" data-onsuccess="onSignIn" ></div>
                </div>
            </div>
        </Layout>
    )
}

Login.getInitialProps = async ({ req }) => {
    let user = app.getUser(req);
    console.log("@@ user = " + JSON.stringify(user));
    return {
        user
    }
}

export default withRouter(Login)
