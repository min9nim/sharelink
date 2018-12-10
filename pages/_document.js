// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./pages/_document.js
import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <html>
                <Head>
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <meta name="theme-color" content="#91171F"></meta>

                    {/* 구글로그인 */}
                    <meta name="google-signin-scope" content="profile email" />
                    <meta name="google-signin-client_id" content="314955303656-ohiovevqbpms4pguh82fnde7tvo9cqnb.apps.googleusercontent.com" />
                    {/* <script src="https://apis.google.com/js/platform.js?onload=init" async defer></script> */}
                    <script src="https://apis.google.com/js/client:plusone.js" type="text/javascript"></script>

                    
                    {/* NProgress 모듈 */}
                    <link rel='stylesheet' href='https://unpkg.com/nprogress@0.2.0/nprogress.css' />
                    <script src='https://unpkg.com/nprogress@0.2.0/nprogress.js'></script>

                    {/* Fontello 아이콘 */}
                    <link rel="stylesheet" href="/static/css/style.css"></link>
                    <link rel="stylesheet" href="/static/fontello/css/fontello.css"></link>
                    <style>{`
                    /* custom! */
                    body { margin: 8px }
                    `}</style>
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}