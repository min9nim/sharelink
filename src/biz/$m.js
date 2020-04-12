$m.fn = {
  init: function (sel) {
    if (typeof sel == 'string') {
      this.sel = sel
      this.doms = document.querySelectorAll(sel)
      this.length = this.doms.length
    } else if (sel instanceof $m.fn.init) {
      // $m.fn.init 객체가 들어올 경우
      this.sel = sel.sel
      this.doms = sel.doms
      this.length = sel.length
    } else if (sel instanceof Node) {
      // dom이 들어올 경우
      this.doms = [sel]
      this.length = 1
    } else if (sel[0] instanceof Node) {
      // dom배열이 들어올 경우
      this.doms = sel
      this.length = sel.length
    }
    if (this.length === 1) {
      this.dom = this.doms[0]
    }
  },

  html: function (html) {
    if (this.length == 0) return

    if (html === undefined) {
      return this.doms[0].innerHTML
    }

    $m._each(this.doms, function (dom) {
      dom.innerHTML = html
    })

    return this
  },

  text: function (text) {
    if (this.length == 0) return

    if (text === undefined) {
      return this.doms[0].textContent
    }

    $m._each(this.doms, function (dom) {
      dom.textContent = text
    })

    return this
  },

  css: function (name, value) {
    if (this.length == 0) return

    if (value === undefined) {
      return this.doms[0].style[name]
    }

    if (typeof value === 'number') {
      var arr = ['left', 'top', 'right', 'bottom', 'width', 'height']
      if (arr.indexOf(name) >= 0) {
        value = value + 'px'
      }
    }

    $m._each(this.doms, function (dom) {
      dom.style[name] = value
    })

    return this
  },

  position: function () {
    if (this.length == 0) return

    var top = this.doms[0].style['top']
    top = Number(top.substring(0, top.length - 2))

    var left = this.doms[0].style['left']
    left = Number(left.substring(0, left.length - 2))

    return {
      top: top,
      left: left,
    }
  },

  parent: function (selector, ele) {
    if (this.length === 0) return

    if (ele === undefined) {
      ele = this.doms[0]
    } else {
      if (ele.tagName === 'BODY') return
    }

    if (selector === undefined) {
      return ele.parentNode
    }

    if (selector[0] === '#') {
      // id로 찾기
    } else if (selector[0] === '.') {
      // 클래스로 찾기
    } else {
      // 태그로 찾기
      if (ele.parentNode.tagName === selector.toUpperCase()) {
        return ele.parentNode
      } else {
        return this.parent(selector, ele.parentNode)
      }
    }
  },

  animate: function () {},

  bind: function () {},

  attr: function (name, value) {
    if (this.length == 0) return

    if (value === undefined) {
      return this.doms[0].getAttribute(name)
    }

    $m._each(this.doms, function (dom) {
      dom.setAttribute(name, value)
    })

    return this
  },

  removeAttr: function (name) {
    if (this.length == 0) return

    $m._each(this.doms, function (dom) {
      dom.removeAttribute(name)
    })

    return this
  },

  addClass: function (name) {
    $m._each(this.doms, function (dom) {
      var cls = dom.getAttribute('class')
      if (cls === null) {
        cls = name
      } else {
        cls = cls + ' ' + name
      }
      dom.setAttribute('class', cls)
    })

    return this
  },

  removeClass: function (name) {
    $m._each(this.doms, function (dom) {
      var cls = dom.getAttribute('class')
      if (cls === null) {
        return this
      }
      var arr = cls.split(' ')
      var idx = arr.indexOf(name)
      if (idx < 0) {
        return
      }
      arr.splice(idx, 1)
      dom.setAttribute('class', arr.join(' '))
    })

    return this
  },

  each: function (func) {
    $m._each(this.doms, function (val, key, arr) {
      func.call(val, val, key, arr)
    })

    return this
  },

  remove: function () {
    $m._each(this.doms, function (dom) {
      dom.parentNode.removeChild(dom)
    })
  },

  append: function (elem) {
    $m._each(this.doms, function (dom) {
      if (dom.nodeType === 1 || dom.nodeType === 11 || dom.nodeType === 9) {
        dom.appendChild($m.clone(elem))
      }
    })
    return this
  },

  prepend: function (elem) {
    $m._each(this.doms, function (dom) {
      if (dom.nodeType === 1 || dom.nodeType === 11 || dom.nodeType === 9) {
        dom.insertBefore($m.clone(elem), dom.firstChild)
      }
    })
    return this
  },

  show: function () {
    $m._each(this.doms, function (dom) {
      dom.style.display = 'block'
    })
    return this
  },

  hide: function () {
    $m._each(this.doms, function (dom) {
      dom.style.display = 'none'
    })
    return this
  },

  val: function (value) {
    if (this.length == 0) return

    if (value === undefined) {
      return this.doms[0].value
    }

    $m._each(this.doms, function (dom) {
      dom.value = value
    })

    return this
  },

  focus: function () {
    if (this.length == 0) return

    this.doms[0].focus()
  },
}

$m.fn.init.prototype = $m.fn

// 함수형 프로그래밍을 위한 함수 중심 API
$m.html = function (selector, html) {
  return $m(selector).html(html)
}

$m.css = function (selector, name, value) {
  return $m(selector).css(name, value)
}

$m.val = function (selector, value) {
  return $m(selector).val(value)
}

$m.show = function (selector) {
  return $m(selector).show()
}

$m.hide = function (selector) {
  return $m(selector).hide()
}

export default function $m(sel) {
  return new $m.fn.init(sel)
}
