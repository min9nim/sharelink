import app from '../app'
import { withRouter } from 'next/router'
import './Search.scss'
import { Observable, Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

const isAddMode = (event) =>
  event.target.value.indexOf('http') === 0 && app.auth.isLogin()

class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mode: 'search',
    }

    app.view.Search = this
  }

  componentDidMount() {
    this._ismounted = true
    this.ipt_serarch.focus()

    const observable = new Observable((subscriber) => {
      this.subscriber = subscriber
    })
    const subject = new Subject()

    this.subjectSubscription = observable.subscribe(subject)
    this.keypressSubscription = subject
      .pipe(
        filter(({ type }) => type === 'keypress'),
        filter(({ event }) => (event.keyCode || event.which) === 13),
      )
      .subscribe(({ event }) => {
        app.logger.debug('keypress 처리')
        this.search(event.target.value)
      })
    this.changeSubscription = subject
      .pipe(filter(({ type }) => type === 'change'))
      .subscribe(({ event }) => {
        app.logger.debug('change 처리')
        app.state.word = event.target.value
        this.state.mode = isAddMode(event) ? 'add' : 'search'
      })
  }

  componentWillUnmount() {
    this._ismounted = false
    this.subjectSubscription.unsubscribe()
    this.keypressSubscription.unsubscribe()
    this.changeSubscription.unsubscribe()
  }

  handleChange(e) {
    this.subscriber.next({ type: 'change', event: e })
  }

  handleKeyPress(e) {
    this.subscriber.next({ type: 'keypress', event: e })
  }
  handleBlur(e) {
    if (!e.target.value) {
      return
    }
    this.search(e.target.value)
  }

  search = async (word) => {
    try {
      if (this.state.mode === 'search') {
        await app.api.fetchList({
          menuIdx: app.state.menuIdx,
          idx: 0,
          cnt: app.PAGEROWS,
          word,
        })
        return
      }
      if (!app.user.id) {
        app.logger.warn((m) => console.log(...m('app.user.id is undefined')))
        return
      }

      await app.api.postLink({
        url: app.state.word,
        author: {
          id: app.user.id,
          name: app.user.name,
        },
      })
      this.state.mode = 'search'
      app.state.word = ''
    } catch (e) {
      app.looger.error(e.message)
      alert(e.message)
    }
  }

  render() {
    console.log('Search 렌더링')
    return (
      <div className="ipt-wrapper">
        {app.auth.isLogin() && this.state.mode === 'add' ? (
          <i className="icon-doc-new" />
        ) : (
          <i className="icon-search" />
        )}
        <input
          className="ipt-search"
          ref={(el) => {
            this.ipt_serarch = el
          }}
          value={app.state.word}
          onChange={this.handleChange.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          onBlur={this.handleBlur.bind(this)}
        />
      </div>
    )
  }
}

export default withRouter(Search)
