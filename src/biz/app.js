import { observable, reaction, decorate } from 'mobx'
import $m from './$m'
import getApi from './restful'
import getAuth from './auth'
import Cookies from 'universal-cookie'
import createLogger, { simpleFormat } from 'if-logger'
import moment from 'moment'
import { Subject } from 'rxjs'

moment.locale('ko')

const initialState = {
  links: [],
  totalCount: 0,
  user: {
    id: '',
    name: '',
    email: '',
    image: '',
    token: '',
  },
  menuIdx: 0,
  word: '', // 검색어
  searched: false,
  menu: [
    {
      label: '전체 포스트',
      path: '/',
    },
    {
      label: '내가 등록한 포스트',
      path: '/my',
    },
    {
      label: '내가 좋아하는 포스트',
      path: '/like',
    },
    {
      label: '내가 읽은 포스트',
      path: '/read',
    },
    {
      label: '나중에 읽을 포스트',
      path: '/toread',
    },
  ],
}

const app = {
  $m, // 기본 유틸
  scrollTop: 0, // 목록화면에서 현재 스크롤 위치
  state: initialState,
  view: {}, // 공유가 필요한 react 컴포넌트
  BACKEND: 'https://sharelink-api.now.sh',
  PAGEROWS: 50,
  logger: createLogger({
    format: simpleFormat,
    tags: [() => moment().utc().add(9, 'hours').format('MM/DD HH:mm:ss')],
  }),
}

const logger = app.logger.addTags('app.js')

app.api = getApi(app)
app.auth = getAuth(app)

decorate(app, { state: observable })

app.stateSubject = new Subject()
reaction(
  () => JSON.stringify(app.state),
  () => {
    logger.debug('state feed')
    logger.if(!app.state).warn('app.state is undefined!!')
    app.stateSubject.next(app.state)
  },
)

// app.linksSubject = new Subject()
// reaction(
//   () => JSON.stringify(app.state.links),
//   () => {
//     logger.debug('links feed')
//     app.linksSubject.next(app.state.links)
//   },
// )

app.getUser = async (req) => {
  try {
    let userStr
    if (req) {
      const cookies = new Cookies(req.headers.cookie)
      userStr = Buffer.from(cookies.get('user') || '', 'base64').toString(
        'utf8',
      )
    } else {
      userStr = global.sessionStorage.getItem('user')
    }
    // logger.verbose('userStr:', userStr)

    if (!userStr) {
      throw Error('[getUser] user 정보 없음')
    }
    let user = JSON.parse(userStr)
    app.state.user = user
    let res = await app.api.login()
    if (res.status === 'Fail') {
      throw Error(`[getUser] 로그인 실패 : ${res.message}`)
    }
    // logger.verbose('리턴하기 전', user)
    return user
  } catch (e) {
    logger.warn(e)
    return {}
  }
}

if (process.env.API === 'local') {
  app.BACKEND = 'http://localhost:3030'
}
logger.verbose('process.env.NODE_ENV = [' + process.env.NODE_ENV + ']')
logger.verbose('Backend server : ' + app.BACKEND)

global.app = app
export default app
