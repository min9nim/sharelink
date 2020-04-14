import app from '../biz/app'
import { _findLink } from '../biz'
import { getQueryParams, go } from 'mingutils'
import { prop } from 'ramda'
import Write from '../components/Write'

export default class extends React.Component {
  static async getInitialProps({ req, asPath, query }) {
    const logger = global.logger.addTags('getInitialProps')
    let user = await app.getUser(req)
    logger.verbose('user:', user)
    app.state.user = user

    let link
    if (req) {
      const fetchRes = await go(
        req.url,
        getQueryParams,
        prop('id'),
        app.api.fetchLink,
      )
      link = fetchRes[0]
    } else {
      //link = app.state.links.find(l => l.id === query.id);
      link = _findLink(app.state.links, query.id)
    }

    return {
      menuIdx: 0,
      link,
      user,
    }
  }
  render() {
    return <Write {...this.props} />
  }
}
