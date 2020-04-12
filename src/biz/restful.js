import fetch from 'isomorphic-unfetch'
import { _findLink } from '.'

const req = async (path, method, body) => {
  //global.NProgress && global.NProgress.start();
  global.NProgress?.start()
  //console.log("@@@@ fetch 호출전 path = " + path)
  let opt = {
    method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': app.state.user.token,
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

export default function getApi(app) {
  return {
    // 링크삭제
    deleteLink: async (link) => {
      let json = await req('/links/', 'DELETE', { id: link.id })
      app.state.totalCount--
      if (link.linkID) {
        // 관련 링크를 삭제하는 경우
        let parentLink = app.state.links.find((l) => l.id === link.linkID)
        parentLink.refLinks = parentLink.refLinks.filter(
          (l) => l.id !== link.id,
        )
      } else {
        app.state.links = app.state.links.filter((l) => l.id !== link.id)
      }
      return json
    },

    // 링크추가
    postLink: async (link) => {
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
    },

    // 링크수정
    putLink: async (link) => {
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
    },

    // 글작성시 글제목/글설명/글이미지 가져오기
    webscrap: async (url) => {
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
    },

    // 로그인처리
    login: async () => {
      let json = await req('/login', 'POST')
      return json
    },

    fetchLink: async (linkID) => {
      let json = await req('/links?linkID=' + linkID, 'GET')
      return json
    },

    fetchList: async ({
      menuIdx,
      idx = 0,
      cnt = 10,
      word = app.state.word,
    }) => {
      if (app.view.List) {
        if (idx === 0) {
          app.view.List.state.loading = true
          app.state.links = []
        } else {
          app.view.List._ismounted && app.view.List.setState({ loading: true })
        }
      }

      let path =
        '/links' + app.state.menu[menuIdx].path + '?idx=' + idx + '&cnt=' + cnt
      if (word) {
        path += '&word=' + word
      }

      let fetchRes = await req(path, 'GET')

      if (fetchRes.status === 'Fail') {
        return
      }

      // app.logger.verbose('fetchRes:', fetchRes)
      app.state.totalCount = fetchRes.totalCount
      if (fetchRes.links.length == 0) {
        fetchRes.hasNext = false // 18.12.31 links 길이가 0인데 hasNext 가 true로 떨어지는 경우가 있어서 보정함.
      } else {
        // app.state.links.push(...fetchRes.links)
        app.state.links = app.state.links.concat(fetchRes.links)

        if (app.setState) {
          app.setState({ ...app.state })
        }
      }

      return fetchRes
    },

    // 좋아요
    like: async (link) => {
      // DB 업데이트
      await req('/links/like/', 'PUT', { linkID: link.id })

      // 로컬상태 업데이트
      link.like.push(app.state.user.id)
    },
    // 좋아요 취소
    unlike: async (link) => {
      // DB 업데이트
      let res = await req('/links/unlike/', 'PUT', { linkID: link.id })

      // 로컬상태 업데이트
      link.like = link.like.filter((userID) => userID !== app.state.user.id)
    },
    // 읽음 표시
    read: async (link) => {
      // DB 업데이트
      let res = await req('/links/read/', 'PUT', { linkID: link.id })

      // 로컬상태 업데이트
      link.read.push(app.state.user.id)
    },
    // 읽음표시 취소
    unread: async (link) => {
      // DB 업데이트
      await req('/links/unread/', 'PUT', { linkID: link.id })

      // 로컬상태 업데이트
      link.read = link.read.filter((userID) => userID !== app.state.user.id)
    },
    // 읽을 글 표시
    toread: async (link) => {
      // DB 업데이트
      await req('/links/toread/', 'PUT', { linkID: link.id })

      // 로컬상태 업데이트
      link.toread.push(app.state.user.id)
    },
    // 읽을 글 표시 취소
    untoread: async (link) => {
      // DB 업데이트
      await req('/links/untoread/', 'PUT', { linkID: link.id })

      // 로컬상태 업데이트
      link.toread = link.toread.filter((userID) => userID !== app.state.user.id)
    },

    // 댓글추가
    postComment: async (comment) => {
      let res = await req('/comments', 'POST', comment)
      //app.state.links.push(res.output);
      if (res.status === 'Fail') {
        console.log('등록 실패 : ' + res.message)
        //alert("등록 실패 : " + res.message)
      } else {
        //let link = app.state.links.find(l => l.id === comment.linkID)

        let link = _findLink(app.state.links, comment.linkID)

        if (!link.comments) {
          link.comments = []
        }
        link.comments.push(res.output)
      }
      return res
    },
    deleteComment: async (comment) => {
      let json = await req('/comments/', 'DELETE', comment)
      if (json.status === 'Fail') {
        console.log('댓글 삭제 실패')
      } else {
        // let idx = app.state.links.findIndex(l => l.id === comment.linkID);
        // let comments = app.state.links[idx].comments;
        // app.state.links[idx].comments = comments.filter(c => c.id !== comment.id)

        let link = _findLink(app.state.links, comment.linkID)
        link.comments = link.comments.filter((c) => c.id !== comment.id)
      }
      return json
    },
    putComment: async (comment) => {
      let res = await req('/comments', 'PUT', comment)
      if (res.status === 'Fail') {
        console.log('등록 실패 : ' + res.message)
        //alert("등록 실패 : " + res.message)
      } else {
        // let linkIdx = app.state.links.findIndex(l => l.id === comment.linkID)
        // let commentIdx = app.state.links[linkIdx].comments.findIndex(c => c.id === comment.id);
        // app.state.links[linkIdx].comments[commentIdx] = comment;

        let link = _findLink(app.state.links, comment.linkID)
        let commentIdx = link.comments.findIndex((c) => c.id === comment.id)
        link.comments[commentIdx] = comment
      }
      return res
    },
  }
}
