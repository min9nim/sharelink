import List from '../components/List'
import Layout from '../components/Layout'
import app from '../biz/app'
import { useState, useEffect } from 'react'
import { withLogger } from '../biz'
import { isNode } from 'if-logger'

function Index(props) {
  const logger = props.logger
  // logger.debug('start')
  const [state, setState] = useState({
    ...app.state,
    ...props.fetchRes,
    user: props.user,
  })

  useEffect(() => {
    logger.debug('[1st effect] app.state 세팅', props.user)
    Object.assign(app.state, props.fetchRes, {
      user: props.user,
    })
  }, [])

  useEffect(() => {
    logger.debug('[2nd effect] state food setting')
    const subscriptioin = app.stateSubject.subscribe((state) => {
      const newState = { ...app.state, ...state }
      logger.verbose('state food', newState.user, 99)
      setState(newState)
    })
    return () => {
      subscriptioin.unsubscribe()
    }
  }, [])

  // useEffect(() => {
  //   logger.debug('[Index effect] linksSubject 구독')
  //   const subscription = app.linksSubject.subscribe((links) => {
  //     logger.debug(
  //       '[Index effect] links 구독 중 feed 받아 먹음',
  //       links.length,
  //       app.state.links.length,
  //     )
  //     setState({ ...app.state })
  //   })
  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [])

  logger.verbose('render')
  return (
    <Layout state={state}>
      <List state={state} />
    </Layout>
  )
}

Index.getInitialProps = async ({ req, asPath }) => {
  let menuIdx = app.state.menu.findIndex((m) => m.path === asPath)
  const user = await app.getUser(req)
  const fetchRes = await app.api.fetchList({ menuIdx })

  logger.verbose('Index.getInitialProps', user.id)
  return {
    menuIdx,
    fetchRes,
    user,
  }
}

export default withLogger(Index)
