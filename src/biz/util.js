import base64js from 'base64-js'

export const isDesktop = () => {
  const os = ['win16', 'win32', 'win64', 'mac', 'macintel']
  return (
    global.navigator && os.includes(global.navigator.platform.toLowerCase())
  )
}

export const isMobileChrome = () => {
  return !isDesktop() && global.navigator?.userAgent.includes('Chrome')
}

export const Base64Encode = (str, encoding = 'utf-8') => {
  var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str)
  return base64js.fromByteArray(bytes)
}

export const Base64Decode = (str, encoding = 'utf-8') => {
  var bytes = base64js.toByteArray(str)
  return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes)
}

// 유틸
export function clone(elem) {
  var newNode
  if (typeof elem === 'string') {
    var tmp = document.createElement('div')
    tmp.innerHTML = elem
    newNode = tmp.firstChild
  } else {
    newNode = elem.cloneNode(true)
  }
  return newNode
}

export function scrollTo(x, y) {
  return window.scrollTo(x, y)
}

export function txtToHtml(str, word) {
  if (word) {
    var reg = new RegExp('(' + word + ')', 'gi')
  }

  return str
    .split('\n')
    .map(function (val) {
      return val
        .split(' ')
        .map(function (val) {
          let newval = val
          if (word) {
            // 매칭단어 하이라이트
            newval = newval.replace(
              reg,
              '<span style="background-color:yellow;">$1</span>',
            )
          }
          if (val.indexOf('http://') == 0 || val.indexOf('https://') == 0) {
            return `<a href="${val}" target="_blank">${newval}</a>`
          } else {
            return newval
          }
        })
        .join(' ')
        .replace(/  /gi, '&nbsp;&nbsp') // html태그를 사용하기 위해 html태그 밖에서만 공백문자를 &nbsp; 치환할 수 있도록 수정 필요
    })
    .join('<br/>') // 새줄문자 <br/> 치환
}

// 함수형 프로그래밍 라이브러리
export function _curry(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(a, b)
  }
}

export function _curryr(fn) {
  return function (a, b) {
    return arguments.length === 2 ? fn(a, b) : (b) => fn(b, a)
  }
}

export const _each = _curryr(function (list, fn) {
  if (typeof list !== 'object' || !list) {
    return []
  }
  var keys = Object.keys(list)
  for (var i = 0; i < keys.length; i++) {
    fn(list[keys[i]], keys[i], list)
  }
  return list
})

export const _map = _curryr(function (list, mapper) {
  var res = []
  _each(list, function (val, key, list) {
    res.push(mapper(val, key, list))
  })
  return res
})

export const _filter = _curryr(function (list, predi) {
  var res = []
  _each(list, function (val, key, list) {
    if (predi(val, key, list)) {
      res.push(val)
    }
  })
  return res
})

export const _reduce = function (list, iter, init) {
  var res = init
  if (init === undefined) {
    res = list && list[0] // null 체크
    list = list && list.slice(1)
  }
  _each(list, function (val, key, list) {
    res = iter(val, res, key, list)
  })
  return res
}

export const _slice = function (list, begin, end) {
  if (typeof arguments[0] === 'number') {
    var begin = arguments[0]
    var end = arguments[1]
    return function (list) {
      return Array.prototype.slice.call(list, begin, end)
    }
  } else {
    return Array.prototype.slice.call(list, begin, end)
  }
}

export const _join = _curryr((list, delim) =>
  Array.prototype.join.call(list, delim),
)

export const _split = _curryr((str, delim) =>
  String.prototype.split.call(str, delim),
)

export const _gofunction = () => {
  var args = arguments
  var fns = _slice(args, 1)
  return _pipe(fns)(args[0])
}

export const _pipefunction = () => {
  var fns = Array.isArray(arguments[0]) ? arguments[0] : arguments
  return function () {
    return _reduce(
      fns,
      function (val, res, key, list) {
        return val(res)
      },
      arguments[0],
    )
  }
}

export const _find = _curryr(function (list, fn) {
  if (typeof list !== 'object' || !list) {
    return
  }
  var keys = Object.keys(list)
  for (var i = 0; i < keys.length; i++) {
    if (fn(list[keys[i]], keys[i], list)) {
      return list[keys[i]]
    }
  }
})

export const _findIndex = _curryr(function (list, fn) {
  if (typeof list !== 'object' || !list) {
    return
  }
  var keys = Object.keys(list)
  for (var i = 0; i < keys.length; i++) {
    if (fn(list[keys[i]], keys[i], list)) {
      return keys[i]
    }
  }
})

export function removeTag(html) {
  if (!html) return ''
  return html.replace(/(<([^>]+)>)/gi, '')
}

export const removeAnimation = (dom, delay) => {
  return new Promise(function (resolve) {
    dom.style.transition = `transform ${delay}s ease-in-out`
    dom.style.transform = 'scaleY(0)'
    setTimeout(resolve, delay * 1000)
  })
}

export const cancelRemoveAnimation = (dom, delay) => {
  return new Promise(function (resolve) {
    dom.style.transition = `transform ${delay}s ease-in-out`
    dom.style.transform = 'scaleY(1)'
    setTimeout(resolve, delay * 1000)
  })
}

export function createTimelog() {
  const newDate = function () {
    let t = new Date()
    let o = {
      HH: String(t.getHours()).padStart(2, '0'),
      mm: String(t.getMinutes()).padStart(2, '0'),
      ss: String(t.getSeconds()).padStart(2, '0'),
      SSS: String(t.getMilliseconds()).padStart(3, '0'),
      time: t.getTime(),
    }
    return o
  }

  let time = []
  let seq = '#' + Math.floor(Math.random() * 100)
  let o = {
    start: function (str) {
      let t = newDate()
      time = [t.time]
      console.log(`[START${seq} ${t.HH}:${t.mm}:${t.ss}:${t.SSS}] ` + str)
    },
    check: function (str) {
      let t = newDate()
      time.push(t.time)
      let diff = time[time.length - 1] - time[time.length - 2]
      let total = time[time.length - 1] - time[0]
      console.log(
        `[CHECK${seq} ${t.HH}:${t.mm}:${t.ss}:${t.SSS} +${diff}ms / +${total}ms] ` +
          str,
      )
      return diff
    },
  }
  return o
}
export const timelog = createTimelog()
