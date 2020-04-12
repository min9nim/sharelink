import { removeAnimation, cancelRemoveAnimation } from '../biz/util'

export const remove = async (post) => {
  const dom = document.getElementById(post.id)
  if (!confirm('삭제합니다')) {
    return
  }
  removeAnimation(dom, 0.2)

  // DB 삭제처리
  let json = await app.api.deleteLink(post)
  if (json.status === 'Fail') {
    cancelRemoveAnimation(dom, 0.2)
  }
}

export const hasChildren = (link) => {
  if (!link.refLinks) {
    return false
  }
  return link.refLinks.length > 0
}
