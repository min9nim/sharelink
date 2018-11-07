import Layout from '../comps/Layout.js';
import { withRouter } from 'next/router'
//import Head from 'next/head';
import app from "../src/app";
import "./login.scss";


const Login = ({ router, user }) => {
    app.user = user;

    return (
        <Layout>
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
