import app from '../biz/app'

export const isAddable = (word) =>
  word.indexOf('http') === 0 && app.auth.isLogin()

export const search = async () => {
  await app.api.fetchList({
    menuIdx: app.state.menuIdx,
    idx: 0,
    cnt: app.PAGEROWS,
  })
}

export const postLink = async (url) => {
  if (!app.state.user.id) {
    global.logger.warn('app.state.user.id is undefined')
    return
  }
  const result = await app.api.postLink({
    url,
    author: {
      id: app.state.user.id,
      name: app.state.user.name,
    },
  })
  app.state.word = ''
  return result
}
