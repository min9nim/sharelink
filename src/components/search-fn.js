export const isAddMode = (event) =>
  event.target.value.indexOf('http') === 0 && app.auth.isLogin()

export const search = async (word, mode) => {
  if (mode === 'search') {
    app.state.links = []
    await app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: 0,
      cnt: app.PAGEROWS,
    })
    return
  }
  if (!app.user.id) {
    app.logger.warn('app.user.id is undefined')
    return
  }

  await app.api.postLink({
    url: word,
    author: {
      id: app.user.id,
      name: app.user.name,
    },
  })
}
