import Head from 'next/head';
import Header from './Header';
import "./Layout.scss";

const Layout = (props) => (
  <div className="layoutStyle">
    <Head>
      <title>sharelink - 링크공유</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>  
    <Header />
    {props.children}
  </div>
)

export default Layout