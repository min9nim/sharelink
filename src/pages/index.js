import List from '../components/List'
import Layout from '../components/Layout'
import app from '../app'
import { useState, useEffect } from 'react'

export default function Index(props) {
  app.logger.debug('Index start')
  const [state, setState] = useState({ ...app.state, ...props.fetchRes })

  useEffect(() => {
    Object.assign(app.state, props.fetchRes)
  }, [])

  useEffect(() => {
    app.logger.debug('[Index effect] 로긴여부 처리', app.state.links.length)
    if (!props.user?.id) {
      app.auth.signOut()
      return
    }
    app.state.userID = props.user.id
    app.user = props.user
    global.sessionStorage?.setItem('user', JSON.stringify(app.user))
  }, [])

  useEffect(() => {
    app.logger.debug('[Index effect] links 구독', app.state.links.length)
    const subscription = app.linksSubject.subscribe((links) => {
      app.logger.debug(
        '[Index effect] links 구독 중 feed 받아 먹음',
        links.length,
        app.state.links.length,
      )
      setState({ ...app.state })
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  app.logger.debug('Index render')
  return (
    <Layout>
      <List state={state} />
    </Layout>
  )
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
