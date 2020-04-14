import { removeTag } from 'mingutils'
import app from './app'

export function _findLink(links, linkID) {
  let link
  for (let l of links) {
    if (l.id === linkID) {
      link = l
    } else {
      for (let l2 of l.refLinks) {
        if (l2.id === linkID) {
          link = l2
          break
        }
      }
    }
    if (link) break
  }

  return link
}

export function _getHostname(url) {
  let start = url.indexOf('://') + 3
  let end = url.indexOf('/', start)
  return url.slice(start, end)
}

export function isExpired(exp) {
  if (!exp) {
    return true
  }
  let month = 1000 * 60 * 60 * 24 * 30
  return Date.now() > exp + month // 만료시간을 임의로 한달 연장
}

export function avoidXSS(link) {
  return {
    ...link,
    url: removeTag(link.url),
    // title: $m.removeTag(link.title),
    // desc: $m.removeTag(link.desc),
    /**
     * 18.11.19
     * title과 desc 에서는 tag 를 사용할 수 있도록 허용한다.
     * 대신에 내용을 보여줄 때 html 태그를 인코딩하여 처리한다.
     */
    title: link.title,
    desc: link.desc,
    image: removeTag(link.image),
  }
}

export function withLogger(Fn) {
  const Component = (props) => {
    // global.logger.addTags('withLogger').verbose('Component.name:', Component.name)
    return <Fn {...props} logger={global.logger.addTags(Fn.name)} />
  }
  Component.getInitialProps = Fn.getInitialProps
  return Component
}
