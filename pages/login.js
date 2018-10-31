import Layout from '../comps/Layout.js';
import { withRouter } from 'next/router'
import Head from 'next/head';
import app from "../src/app";




const Login = ({router}) => {

    function handleClick(){
        app.auth.signIn().then(function(){
            app.auth.onSiginIn({
                scope: 'profile email'
              });
            router.push("/write");
        });
    }
    

    return (
        <Layout>
            {/* <div className="g-signin2" data-onsuccess="onSignIn" ></div> */}
            <div onClick={handleClick}>구글 로그인</div>
        </Layout>
    )
}

export default withRouter(Login)