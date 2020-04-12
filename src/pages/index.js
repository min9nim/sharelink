import List from '../components/List'
import Layout from '../components/Layout'
import app from '../biz/app'
import { useState, useEffect } from 'react'
import { withLogger } from '../biz'

function Index(props) {
  const logger = props.logger
  logger.debug('start')
  const [state, setState] = useState({
    ...app.state,
    ...props.fetchRes,
    user: props.user,
  })

  useEffect(() => {
    logger.debug('[1st effect] app.state 세팅', props.user)
    Object.assign(app.state, props.fetchRes, { user: props.user })
    // app.state = { ...props.fetchRes, user: props.user }
  }, [])

  useEffect(() => {
    logger.debug('[2nd effect] 로긴여부 처리', app.state.links.length)
    if (!props.user?.id) {
      app.auth.signOut()
      return
    }
    app.state.user = props.user
    global.sessionStorage?.setItem('user', JSON.stringify(app.state.user))
  }, [])

  useEffect(() => {
    logger.debug('[Index effect] links 구독', app.state.links.length)
    const subscription = app.linksSubject.subscribe((links) => {
      logger.debug(
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

  logger.debug('Index render')
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

export default withLogger(Index)
