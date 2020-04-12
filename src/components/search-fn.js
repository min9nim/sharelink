import app from '../biz/app'

export const isAddMode = (word) =>
  word.indexOf('http') === 0 && app.auth.isLogin()

export const search = async (word, mode) => {
  const logger = app.logger.addTags('search-fn')
  logger.verbose('mode', mode)
  if (mode === 'search') {
    app.state.links = []
    await app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: 0,
      cnt: app.PAGEROWS,
    })
    return
  }
  if (!app.state.user.id) {
    app.logger.warn('app.state.user.id is undefined')
    return
  }

  await app.api.postLink({
    url: word,
    author: {
      id: app.state.user.id,
      name: app.state.user.name,
    },
  })
}
