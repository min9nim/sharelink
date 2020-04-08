import { observable, reaction, decorate } from 'mobx'
import $m from './com/util'
import getApi from './restful'
import getAuth from './auth'
import base64js from 'base64-js'
import Cookies from 'universal-cookie'
import createLogger, { simpleFormat } from 'if-logger'
import moment from 'moment'
// import React from 'react'

const initialState = {
  links: [],
  totalCount: 0,
  userID: '',
  menuIdx: 0,
  word: '', // 검색어
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
  user: {
    id: '',
    name: '',
    email: '',
    image: '',
    token: '',
  },
  view: {}, // 공유가 필요한 react 컴포넌트
  BACKEND: 'https://sharelink-api.now.sh',
  PAGEROWS: 10,
}

app.logger = createLogger({
  format: simpleFormat,
  tags: [() => moment().utc().add(9, 'hours').format('MM/DD HH:mm:ss')],
})

app.api = getApi(app)
app.auth = getAuth(app)

decorate(app, { state: observable })

// 변화에 따른 효과를 정의
// reaction(
//   () => JSON.stringify(app.state.links),
//   () => {
//     app.logger.debug('변화 감지')
//     app.view.Index && app.view.Index._ismounted && app.view.Index.forceUpdate()
//   },
// )

reaction(
  () => JSON.stringify(app.state.word),
  () => {
    app.view.Search &&
      app.view.Search._ismounted &&
      app.view.Search.forceUpdate()
  },
)

reaction(
  () => app.state.userID,
  async () => {
    // app.state.userID 값을 바라보며 앱의 로그인 여부를 판단한다.
    if (app.auth.isLogin()) {
      // console.log("로그인 상태")
    } else {
      // document.cookie = "user="
      // global.sessionStorage.setItem("user", "");
      // app.user = {
      //     id: "",
      //     name: "",
      //     email: "",
      //     image: "",
      //     token: ""
      // };
      if (app.router && app.router.pathname.indexOf('/write') === 0) {
        //app.router.push("/login");
        location.href = '/login'
      }

      // console.log("로그아웃 됨")
    }

    app.view.Header &&
      app.view.Header._ismounted &&
      app.view.Header.forceUpdate()
    app.view.List && app.view.List._ismounted && app.view.List.forceUpdate()
  },
)

// app.ReactCtx = React.createContext(initialState)
app.isDesktop = function () {
  const os = ['win16', 'win32', 'win64', 'mac', 'macintel']
  return (
    global.navigator && os.includes(global.navigator.platform.toLowerCase())
  )
}

app.isMobileChrome = function () {
  return (
    !app.isDesktop() &&
    global.navigator &&
    global.navigator.userAgent.includes('Chrome')
  )
}

app.Base64Encode = (str, encoding = 'utf-8') => {
  var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str)
  return base64js.fromByteArray(bytes)
}

app.Base64Decode = (str, encoding = 'utf-8') => {
  var bytes = base64js.toByteArray(str)
  return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes)
}

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
    // app.logger.verbose('userStr:', userStr)

    if (!userStr) {
      throw Error('[getInitialProps] 로그인 실패 : user 정보 없음')
    }
    let user = JSON.parse(userStr)
    app.user.token = user.token
    let res = await app.api.login()
    if (res.status === 'Fail') {
      throw Error(`[getInitialProps] 로그인 실패 : ${res.message}`)
    }
    return user
  } catch (e) {
    app.logger.error(e)
    return {}
  }
}

if (process.env.API === 'local') {
  app.BACKEND = 'http://localhost:3030'
}
app.logger.verbose('process.env.NODE_ENV = [' + process.env.NODE_ENV + ']')
app.logger.verbose('Backend server : ' + app.BACKEND)

global.app = app
export default app
