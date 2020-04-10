import app from '../app'
import { withRouter } from 'next/router'
import './Search.scss'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'
import { useState, useEffect } from 'react'
import { withLogger } from '../com/pure'

const isAddMode = (event) =>
  event.target.value.indexOf('http') === 0 && app.auth.isLogin()

const search = async (word, mode) => {
  if (mode === 'search') {
    app.state.links = []
    await app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: 0,
      cnt: app.PAGEROWS,
    })
    return
  }
  if (!app.user.id) {
    props.logger.warn('app.user.id is undefined')
    return
  }

  await app.api.postLink({
    url: word,
    author: {
      id: app.user.id,
      name: app.user.name,
    },
  })
}

function Search(props) {
  props.logger.debug('start')
  const [state, setState] = useState({
    mode: 'search',
    word: '',
    subject: null,
  })

  useEffect(() => {
    props.logger.debug('useEffect')
    state.subject = new Subject()
    const keypressSubscription = state.subject
      .pipe(
        filter(
          ({ type, event }) =>
            type === 'keypress' && (event.keyCode || event.which) === 13,
        ),
      )
      .subscribe(({ event }) => {
        props.logger.debug('keypress 처리')
        search(event.target.value, state.mode)
      })
    const changeSubscription = state.subject
      .pipe(filter(({ type }) => type === 'change'))
      .subscribe(({ event }) => {
        props.logger.debug('change 처리', event.target.value)
        app.state.word = event.target.value
        setState({
          ...state,
          mode: isAddMode(event) ? 'add' : 'search',
        })
      })
    const blurSubscription = state.subject
      .pipe(filter(({ type, event }) => type === 'blur' && event.target.value))
      .subscribe(({ event }) => {
        props.logger.debug('blur 처리', event.target.value)
        search(event.target.value, state.mode)
      })
    return () => {
      props.logger.debug('unsubscribe')
      keypressSubscription.unsubscribe()
      changeSubscription.unsubscribe()
      blurSubscription.unsubscribe()
    }
  }, [])

  props.logger.debug('Search render')
  return (
    <div className="ipt-wrapper">
      {app.auth.isLogin() && state.mode === 'add' ? (
        <i className="icon-doc-new" />
      ) : (
        <i className="icon-search" />
      )}
      <input
        className="ipt-search"
        autoFocus
        value={app.state.word}
        onChange={(e) => state.subject.next({ type: 'change', event: e })}
        onKeyPress={(e) => state.subject.next({ type: 'keypress', event: e })}
        onBlur={(e) => state.subject.next({ type: 'blur', event: e })}
      />
    </div>
  )
}

export default withRouter(withLogger(Search))
