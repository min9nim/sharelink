export function menuOutClick(e) {
  let clickMenu = [e.target.className]

  if (e.target.parentNode) {
    clickMenu.push(e.target.parentNode.className)
    if (e.target.parentNode.parentNode) {
      clickMenu.push(e.target.parentNode.parentNode.className)
    }
  }

  if (clickMenu.includes('menu')) {
    return
  }
  props.hideMenu()
}
