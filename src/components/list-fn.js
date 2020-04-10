import { map } from 'ramda'
import { observeDom } from '../com/pure.js'

export function imageLazyLoad() {
  const loadImage = (img) => {
    if (img.dataset.src) {
      img.src = img.dataset.src
    } else {
      img.removeAttribute('src')
    }
    img.removeAttribute('data-src')
    img.classList.remove('lazy')
  }
  const lazyloadImages = document.querySelectorAll('.lazy')

  return map((item) => observeDom(item, loadImage))(lazyloadImages)
}

export function infiniteLoading() {
  const lastPost = document.querySelector(
    '.PostList > li:last-child > .wrapper',
  )

  if (!lastPost) {
    app.logger.addTags('List').warn('not found lastPost')
    return () => {}
  }
  app.logger.addTags('List').debug('마지막 요소 지켜보기 설정')

  return observeDom(lastPost, () => {
    app.logger
      .addTags('List')
      .debug('observeDom lastPost fetch call', app.state.links.length)
    app.api.fetchList({
      menuIdx: app.state.menuIdx,
      idx: app.state.links.length,
      cnt: app.PAGEROWS,
    })
  })
}
