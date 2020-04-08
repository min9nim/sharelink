import List from '../components/List.js'
import app from '../app'
import { useState, useEffect } from 'react'
import { isNode } from 'if-logger'

export default function Index(props) {
  const [state, setState] = useState({ ...app.state, ...props.fetchRes })
  // app.logger.debug(
  //   'Index 렌더',
  //   state.links.length,
  //   props.fetchRes.links.length,
  // )
  app.setState = setState

  useEffect(() => {
    if (!props.user?.id) {
      if (isNode()) {
        return
      }
      app.auth.signOut()
      return
    }
    app.state.userID = props.user.id
    app.user = props.user
    global.sessionStorage?.setItem('user', JSON.stringify(app.user))
  }, [props.user])

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
