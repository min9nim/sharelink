import app from '../app'
import { withRouter } from 'next/router'
import './Search.scss'
import { Observable } from 'rxjs'
import { throttleTime } from 'rxjs/operators'

class Search extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      mode: 'search',
    }

    app.view.Search = this

    // Observable 생성
    //this.text$ = new Rx.Subject();
  }

  componentDidMount() {
    this._ismounted = true
    this.ipt_serarch.focus()

    const observable = new Observable((subscriber) => {
      this.subscriber = subscriber
    })
    this.subscription = observable.subscribe(({ type, event }) => {
      app.logger.debug('여기')
      if (type === 'keypress') {
        let keyCode = event.keyCode || event.which
        if (keyCode === 13) {
          this.search(event.target.value)
        }
        return
      }
      if (event.target.value.indexOf('http') === 0) {
        if (app.auth.isLogin()) {
          this.state.mode = 'add'
        } else {
          this.state.mode = 'search'
        }
      } else {
        this.state.mode = 'search'
      }
      app.state.word = event.target.value
    })
  }

  componentWillUnmount() {
    this._ismounted = false
    this.subscription.unsubscribe()
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
