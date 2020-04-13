import { isExpired } from '.'
import { base64Encode } from './util'
import createLogger, { isNode, simpleFormat } from 'if-logger'
import app from './app'
import Cookies from 'universal-cookie'

const logger = createLogger({
  format: simpleFormat,
  tags: ['auth.js'],
})

async function onGApiLoad() {
  // 구글 로그인 초기화
  await gapi.client.init({
    apiKey: 'sharelink',
    clientId:
      '314955303656-ohiovevqbpms4pguh82fnde7tvo9cqnb.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
  })
  global.GoogleAuth = global.gapi.auth2.getAuthInstance()
  logger.verbose('GoogleAuth initialized')

  global.GoogleAuth.isSignedIn.listen(() => {
    logger.verbose('isSignedIn listen..')
  })
}

export function init() {
  if (isNode() || global.GoogleAuth || app.router.asPath === '/login') {
    // logger.debug(m => console.log(...m('gapi.load() is not necessary')))
    return
  }

  gapi.load('client', {
    callback: onGApiLoad,
    onerror: logger.error,
    timeout: 10000, // 10 seconds.
    ontimeout() {
      logger.debug((m) => console.log(...m('gapi.load timeout')))
    },
  })
}

export function setLogin(user, id_token) {
  app.state.user = { ...user, token: id_token }
  const enc = base64Encode(JSON.stringify(app.state.user))

  // 쿠키 만료일을 한달 후로 지정
  const month = 1000 * 60 * 60 * 24 * 30
  const exp = new Date(app.state.user.exp * 1000 + month).toUTCString()
  document.cookie = `user=${enc}; expires=${exp}; path=/`

  sessionStorage.setItem('user', JSON.stringify(app.state.user))
}

export function isLogin(state = app.state) {
  return Boolean(state.user.id && !isExpired(state.user.exp * 1000))
}

export function signOut() {
  logger.debug('signOut 처리')
  // 애플리케이션 로그아웃처리

  global.document.cookie = 'user='
  global.sessionStorage.setItem('user', '')
  app.state.user = {
    id: '',
    name: '',
    email: '',
    image: '',
    token: '',
  }

  // 구글 로그아웃처리
  //let GoogleAuth = gapi.auth2.getAuthInstance();
  // if(global.GoogleAuth){
  //     global.GoogleAuth.signOut().then(() => {
  //         console.log("GoogleAuth.signOut() 완료 후 콜백");
  //     });
  // }

  global.GoogleAuth?.signOut().then(() => {
    console.log('GoogleAuth.signOut() 완료 후 콜백')
  })
}

export async function getUser(req) {
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

export default {
  init,
  setLogin,
  isLogin,
  signOut,
  getUser,
}
