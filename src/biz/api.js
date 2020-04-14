import fetch from 'isomorphic-unfetch'
import { _findLink } from '.'
import app from './app'
import { omit } from 'ramda'

export async function req(path, method, body = {}) {
  global.NProgress?.start()
  let opt = {
    method,
    body: JSON.stringify(omit(['token', body])),
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': body.token || app.state.user.token,
    },
  }

  let res = await fetch(app.BACKEND + path, opt)
  global.NProgress?.done()

  if (!res.ok) {
    throw new Error(path + ' : ' + '[' + res.status + ']')
  }
  let json = await res.json()
  if (json.status === 'Fail') {
    throw Error(json.message)
  }
  return json
}

// 링크삭제
export async function deleteLink(link) {
  let json = await req('/links/', 'DELETE', { id: link.id })
  app.state.totalCount--
  if (link.linkID) {
    // 관련 링크를 삭제하는 경우
    let parentLink = app.state.links.find((l) => l.id === link.linkID)
    parentLink.refLinks = parentLink.refLinks.filter((l) => l.id !== link.id)
  } else {
    app.state.links = app.state.links.filter((l) => l.id !== link.id)
  }
  return json
}

// 링크추가
export async function postLink(link) {
  let res = await req('/links', 'POST', link)
  app.state.totalCount++
  if (res.output.linkID) {
    // 관련글 등록인 경우
    let parentLink = app.state.links.find((l) => l.id === res.output.linkID)
    if (!parentLink.refLinks) {
      parentLink.refLinks = []
    }
    parentLink.refLinks.push(res.output)
  } else {
    app.state.links.unshift(res.output)
  }
}

// 링크 수정
export async function putLink(link) {
  // DB 업데이트
  await req('/links/', 'PUT', Object.assign(link, { id: link.id }))

  if (app.state.links.length === 0) return

  // 로컬상태 업데이트
  if (link.linkID) {
    let parentLink = _findLink(app.state.links, link.linkID)
    let asisIdx = parentLink.refLinks.findIndex((l) => l.id === link.id)
    parentLink.refLinks[asisIdx] = link
  } else {
    let asisIdx = app.state.links.findIndex((l) => l.id === link.id)
    app.state.links[asisIdx] = link
  }
}

// 글작성시 글제목/글설명/글이미지 가져오기
export async function webscrap(url) {
  // let json = await req("/webscrap", "POST", { url })
  const json = await fetch('https://webscrap.now.sh/webscrap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
    }),
  }).then((res) => res.json())
  return json
}

// 로그인처리
export async function login(token) {
  let json = await req('/login', 'POST', { token })
  return json
}

export async function fetchLink(linkID) {
  let json = await req('/links?linkID=' + linkID, 'GET')
  return json
}

export async function fetchList({
  menuIdx,
  idx = 0,
  cnt = app.PAGEROWS,
  word = app.state.word,
}) {
  if (idx === 0) {
    app.state.links = []
  }

  let path =
    '/links' + app.state.menu[menuIdx].path + '?idx=' + idx + '&cnt=' + cnt
  if (word) {
    path += '&word=' + word
  }

  const fetchRes = await req(path, 'GET')
  if (word) {
    app.state.searched = true
  }

  if (fetchRes.status !== 'Fail') {
    app.state.totalCount = fetchRes.totalCount
    app.state.links = app.state.links.concat(fetchRes.links)
    app.state.hasNext = fetchRes.hasNext
  }

  return fetchRes
}

// 좋아요
export async function like(link) {
  // DB 업데이트
  await req('/links/like/', 'PUT', { linkID: link.id })

  // 로컬상태 업데이트
  link.like.push(app.state.user.id)
}

// 좋아요 취소
export async function unlike(link) {
  // DB 업데이트
  let res = await req('/links/unlike/', 'PUT', { linkID: link.id })

  // 로컬상태 업데이트
  link.like = link.like.filter((userID) => userID !== app.state.user.id)
}

// 읽음 표시
export async function read(link) {
  await req('/links/read/', 'PUT', { linkID: link.id })
  link.read.push(app.state.user.id)
}

// 읽음표시 취소
export async function unread(link) {
  await req('/links/unread/', 'PUT', { linkID: link.id })
  link.read = link.read.filter((userID) => userID !== app.state.user.id)
}

// 읽을 글 표시
export async function toread(link) {
  await req('/links/toread/', 'PUT', { linkID: link.id })
  link.toread.push(app.state.user.id)
}

// 읽을 글 표시 취소
export async function untoread(link) {
  await req('/links/untoread/', 'PUT', { linkID: link.id })
  link.toread = link.toread.filter((userID) => userID !== app.state.user.id)
}

// 댓글추가
export async function postComment(comment) {
  const res = await req('/comments', 'POST', comment)
  const link = _findLink(app.state.links, comment.linkID)
  if (!link.comments) {
    link.comments = []
  }
  link.comments.push(res.output)
  return res
}
export async function deleteComment(comment) {
  const json = await req('/comments/', 'DELETE', comment)
  const link = _findLink(app.state.links, comment.linkID)
  link.comments = link.comments.filter((c) => c.id !== comment.id)
  return json
}
export async function putComment(comment) {
  const res = await req('/comments', 'PUT', comment)
  let link = _findLink(app.state.links, comment.linkID)
  let commentIdx = link.comments.findIndex((c) => c.id === comment.id)
  link.comments[commentIdx] = comment
  return res
}

export default {
  deleteLink,
  postLink,
  putLink,
  webscrap,
  login,
  fetchLink,
  fetchList,
  like,
  unlike,
  read,
  unread,
  toread,
  untoread,
  postComment,
  deleteComment,
  putComment,
}
