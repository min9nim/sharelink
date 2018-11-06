import fetch from 'isomorphic-unfetch';
import app from "../src/app";


const req = async (path, method, body) => {
    global.NProgress && global.NProgress.start();
    //console.log("@@@@ fetch 호출전 path = " + path)
    let opt = {
        method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            "x-access-token": app.user.token
        }
    };

    //console.log("@@@@ fetch 호출전 app.user.token = " + JSON.stringify(opt, null, 2))
    let res = await fetch(app.BACKEND + path, opt)
    let json = await res.json();
    global.NProgress && global.NProgress.done();

    return json;
};

export default function getApi(app) {
    return {
        // 링크삭제
        deleteLink: async (id) => {
            await req("/links/" + id, 'DELETE');
            app.state.links = app.state.links.filter(l => l.id !== id);
        },

        // 링크추가
        postLink: async (link) => {
            await req("/links", "POST", link);
            app.state.links.push(link);
        },

        // 링크수정
        putLink: async (link) => {
            // DB 업데이트
            await req("/links/", "PUT", link);

            // 로컬상태 업데이트
            var asisIdx = app.state.links.findIndex(l => l.id === link.id);
            //app.state.links.splice(asisIdx, 1, link);
            app.state.links[asisIdx] = link;
        },

        // 글작성시 글제목/글설명/글이미지 가져오기
        webscrap: async (url) => {
            let json = await req("/webscrap", "POST", { url })
            return await json;
        },

        // 로그인처리
        login: async () => {
            //let json = await req("/login", "POST", { token })
            let json = await req("/login", "POST")
            return json;
        },


        fetchList: async (path, idx = 0, cnt = 10) => {
            let json;

            if (idx === 0) {
                app.view.List.state.loading = true;
                app.state.links = [];
            } else {
                app.view.List._ismounted && app.view.List.setState({ loading: true })
            }

            //            let userID = app.state.menuIdx ? "/" + app.user.id : "";
            //            json = await req(path + userID + "?idx=" + idx + "&cnt=" + cnt, "GET");

            json = await req(path + "?idx=" + idx + "&cnt=" + cnt, "GET");

            app.view.List.state.loading = false;
            //app.state.links = app.state.links.concat(json);
            app.state.links.push(...json.links);

            app.state.isScrollLast = !json.hasNext;

            return json.links;

        },

        // 좋아요
        like: async (link) => {
            // DB 업데이트
            await req("/links/like/", "PUT", { linkID: link.id });

            // 로컬상태 업데이트
            link.like.push(app.user.id);
        },
        // 좋아요 취소
        unlike: async (link) => {
            // DB 업데이트
            let res = await req("/links/unlike/", "PUT", { linkID: link.id });

            // 로컬상태 업데이트
            link.like = link.like.filter(userID => userID !== app.user.id);
        },
        // 읽음 표시
        read: async (link) => {
            // DB 업데이트
            let res = await req("/links/read/", "PUT", { linkID: link.id });

            // 로컬상태 업데이트
            link.read.push(app.user.id);
        },
        // 읽음표시 취소
        unread: async (link) => {
            // DB 업데이트
            await req("/links/unread/", "PUT", { linkID: link.id });

            // 로컬상태 업데이트
            link.read = link.read.filter(userID => userID !== app.user.id);
        },
        // 읽을 글 표시
        toread: async (link) => {
            // DB 업데이트
            await req("/links/toread/", "PUT", { linkID: link.id });

            // 로컬상태 업데이트
            link.toread.push(app.user.id);
        },
        // 읽을 글 표시 취소
        untoread: async (link) => {
            // DB 업데이트
            await req("/links/untoread/", "PUT", { linkID: link.id });

            // 로컬상태 업데이트
            link.toread = link.toread.filter(userID => userID !== app.user.id);
        },
    };
};


