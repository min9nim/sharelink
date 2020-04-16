import { map } from 'ramda'
import { observeDom } from '../biz/util'
import { fetchList } from '../biz/api'
import app from '../biz/app'

// export function imageLazyLoad() {
//   const loadImage = (img) => {
//     if (img.dataset.src) {
//       img.src = img.dataset.src
//     } else {
//       img.removeAttribute('src')
//     }
//     img.removeAttribute('data-src')
//     img.classList.remove('lazy')
//   }
//   const lazyloadImages = document.querySelectorAll('.lazy')

//   return map((item) => observeDom(item, loadImage))(lazyloadImages)
// }

export function infiniteLoading({ logger, setLoading }) {
  if (!app.state.hasNext) {
    logger.info('no more content')
    return () => {}
  }
  const lastPost = document.querySelector(
    '.PostList > li:last-child > .wrapper',
  )

  if (!lastPost) {
    logger.warn('not found lastPost')
    return () => {}
  }
  // logger.debug('마지막 요소 지켜보기 설정')

  return observeDom(lastPost, async () => {
    logger.debug('observeDom lastPost fetch call', app.state.links.length)
    setLoading(true)
    await fetchList({
      menuIdx: app.state.menuIdx,
      idx: app.state.links.length,
      cnt: app.PAGEROWS,
    })
    setLoading(false)
  })
}
