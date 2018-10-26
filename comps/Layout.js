import Head from 'next/head';
import Header from './Header';

const Layout = (props) => (
  <div className="layoutStyle">
    <Head>
      <title>My page title</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>  
    <Header />
    {props.children}

    <style jsx>{`
    .layoutStyle {
      margin: 0px auto;
      padding: 0px 15px;
      max-width: 1000px;
    }

  `}</style>    
  </div>
)

export default Layout