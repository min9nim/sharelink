import List from '../components/List.js'
import app from '../src/app'
import { useState, useEffect } from 'react'

export default function Index(props) {
  const [state, setState] = useState({ ...app.state, ...props.fetchRes })
  app.logger.debug(
    'Index 렌더',
    state.links.length,
    props.fetchRes.links.length,
  )
  app.setState = setState

  useEffect(() => {
    if (props.user?.id) {
      app.state.userID = props.user.id
      app.user = props.user
      global.sessionStorage &&
        global.sessionStorage.setItem('user', JSON.stringify(app.user))
    } else {
      if (global.document) {
        // 클라이언트에서 실행시
        app.auth.signOut()
      }
    }
  }, [props.user])

  useEffect(() => {
    app.logger.debug('Index useEffect')
    setState({ ...state, ...props.fetchRes })
  }, [props.fetchRes])

  return <List state={state} />
}

Index.getInitialProps = async ({ req, asPath }) => {
  let menuIdx = app.state.menu.findIndex((m) => m.path === asPath)
  let [user, fetchRes] = await Promise.all([
    app.getUser(req),
    app.api.fetchList({ menuIdx }),
  ])
  return {
    menuIdx,
    fetchRes,
    user,
  }
}
