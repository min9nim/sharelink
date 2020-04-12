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

/**
 * 18.11.19
 * htmlspecialchars, htmlspecialchars_decode 소스출처: https://stackoverflow.com/questions/5499078/fastest-method-to-escape-html-tags-as-html-entities
 */
export function htmlspecialchars(str) {
  if (!str) return ''

  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;', // ' -> &apos; for XML only
  }
  return str.replace(/[&<>"']/g, function (m) {
    return map[m]
  })
}

export function htmlspecialchars_decode(str) {
  if (!str) return ''

  var map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }
  return str.replace(/(&amp;|&lt;|&gt;|&quot;|&#39;)/g, function (m) {
    return map[m]
  })
}

export function withLogger(Component) {
  return (props) => {
    app.logger.addTags('withLogger').verbose('Component.name:', Component.name)
    return <Component {...props} logger={app.logger.addTags(Component.name)} />
  }
}

export function observeDom(dom, callback) {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return
      }
      callback(entry.target)
      observer.unobserve(entry.target)
    })
  })
  observer.observe(dom)
  return () => {
    observer.unobserve(dom)
  }
}
