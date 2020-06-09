import List from '../components/List'
import Layout from '../components/Layout'
import app from '../biz/app'
import { useState, useEffect } from 'react'
import { withLogger } from '../biz'

function Index(props) {
  const logger = props.logger
  // logger.debug('start')
  const [state, setState] = useState({
    ...app.state,
    ...props.fetchRes,
    user: props.user,
  })

  useEffect(() => {
    logger.debug('[1st effect] initialize app.state', props.user)
    Object.assign(app.state, props.fetchRes, {
      user: props.user,
    })
  }, [])

  useEffect(() => {
    logger.debug('[2nd effect] subscribe stateSubject')
    const subscriptioin = app.stateSubject.subscribe((state) => {
      const newState = { ...app.state, ...state }
      logger.verbose('state food', newState.user)
      setState(newState)
    })
    return () => {
      subscriptioin.unsubscribe()
    }
  }, [])

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
