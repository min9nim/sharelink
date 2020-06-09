import Head from 'next/head'
import Header from './Header'
import { withRouter } from 'next/router'
import { withLogger } from '../biz'
import app from '../biz/app'
import { ThemeProvider } from '../context/theme'
import './Layout.scss'

const Layout = (props) => {
  // console.log("Layout 렌더링..");

  app.router = props.router
  app.auth.init()

  return (
    <ThemeProvider>
      <div className="layoutStyle">
        <Head>
          <title>sharelink - 링크공유</title>
        </Head>
        <div>
          <Header state={props.state} />
        </div>
        {props.children}
      </div>
    </ThemeProvider>
  )
}

export default withRouter(withLogger(Layout))
