import List from '../components/List.js'
import app from '../src/app'
// import { useState, useEffect } from 'react'
// export function Index(props) {
//   const [state, setState] = useState(app.state)
//   app.logger.debug('Index 렌더', app.setState === setState, state.links.length)

//   useEffect(() => {
//     Index._ismounted = true
//     app.view.Index = Index
//     return () => {
//       Index._ismounted = false
//     }
//   })
//   app.setState = setState
//   return <List {...props} state={state} />
// }

export default class Index extends React.Component {
  constructor(props) {
    console.log('Index  생성자 ', props)
    super(props)
    app.state.totalCount = props.fetchRes.totalCount
  }
  componentDidMount() {
    console.log('Index  componentDidMount ', this.props)

    app.view.Index = this
    this._ismounted = true
  }
  componentWillUnmount() {
    this._ismounted = false
  }
  static async getInitialProps({ req, asPath }) {
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

  render() {
    console.log('Index render', app.state)
    return <List {...this.props} state={app.state} />
  }
}
