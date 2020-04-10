import { isExpired } from './com/pure'
import createLogger, { isNode, simpleFormat } from 'if-logger'

async function onGApiLoad() {
  const logger = createLogger({
    format: simpleFormat,
    tags: ['app.auth', 'onGApiLoad'],
  })
  // 구글 로그인 초기화
  await gapi.client.init({
    apiKey: 'sharelink',
    clientId:
      '314955303656-ohiovevqbpms4pguh82fnde7tvo9cqnb.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive.metadata.readonly',
  })
  global.GoogleAuth = global.gapi.auth2.getAuthInstance()
  logger.debug((m) => console.log(...m('GoogleAuth initialized')))

  global.GoogleAuth.isSignedIn.listen(() => {
    logger.verbose('isSignedIn listen..')
  })
}

export default function getAuth(app) {
  const logger = createLogger({ tags: ['app.auth'] })
  return {
    // 로그인 관련
    init: () => {
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
    },

    setLogin: (user, id_token) => {
      app.user = user
      app.user.token = id_token
      app.state.userID = user.id
      const enc = app.Base64Encode(JSON.stringify(app.user))

      // 쿠키 만료일을 한달 후로 지정
      const month = 1000 * 60 * 60 * 24 * 30
      const exp = new Date(app.user.exp * 1000 + month).toUTCString()
      document.cookie = `user=${enc}; expires=${exp}; path=/`

      sessionStorage.setItem('user', JSON.stringify(app.user))
    },

    isLogin: () => app.state.userID && !isExpired(app.user.exp * 1000),

    signOut: () => {
      logger.debug('signOut 처리')
      // 애플리케이션 로그아웃처리

      global.document.cookie = 'user='
      global.sessionStorage.setItem('user', '')
      app.user = {
        id: '',
        name: '',
        email: '',
        image: '',
        token: '',
      }
      app.state.userID = ''

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
    },
  }
}
