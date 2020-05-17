import app from '../biz/app'

export const isAddable = (word) =>
  word.indexOf('http') === 0 && app.auth.isLogin()

export const search = async (word, mode) => {
  const logger = global.logger.addTags('search-fn')
  if (mode === 'search') {
    await app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: 0,
      cnt: app.PAGEROWS,
    })
    return
  }
  if (!app.state.user.id) {
    global.logger.warn('app.state.user.id is undefined')
    return
  }

  await app.api.postLink({
    url: word,
    author: {
      id: app.state.user.id,
      name: app.state.user.name,
    },
  })
  app.state.word = ''
}
