import { observable, reaction, decorate } from 'mobx'
import $m from './$m'
import api from './api'
import auth from './auth'
import createLogger, { simpleFormat } from 'if-logger'
import moment from 'moment'
import { Subject } from 'rxjs'

moment.locale('ko')

const logger = createLogger({
  format: simpleFormat,
  tags: [() => moment().utc().add(9, 'hours').format('MM/DD HH:mm:ss')],
})

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
  hasNext: true,
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
  PAGEROWS: 20,
  api,
  auth,
  getUser: auth.getUser,
  stateSubject: new Subject(),
  logger,
}
export default app

decorate(app, { state: observable })
reaction(
  () => JSON.stringify(app.state),
  () => {
    logger.debug('state feed')
    app.stateSubject.next(app.state)
  },
)

if (process.env.API === 'local') {
  app.BACKEND = 'http://localhost:3030'
}
logger.verbose('process.env.NODE_ENV = [' + process.env.NODE_ENV + ']')
logger.verbose('Backend server : ' + app.BACKEND)

global.app = app
