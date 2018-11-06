import fetch from 'isomorphic-unfetch';
import app from "../src/app";

const req = async (path, method, body) => {
    try{
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
        console.log("url = " + app.BACKEND + path)
        let res = await fetch(app.BACKEND + path, opt)
        let json = await res.json();
        global.NProgress && global.NProgress.done();
    
        return json;
    }catch(e){
        console.error(e);
        //global.alert && global.alert(e.message);
    }
};

export default function getApi(app) {
    return {
        // 링크삭제
        deleteLink: async (link) => {
            await req("/links/", 'DELETE', { linkID: link.id });
            app.state.links = app.state.links.filter(l => l.id !== link.id);
        },

        // 링크추가
        postLink: async (link) => {
            await req("/links", "POST", link);
            app.state.links.push(link);
        },

        // 링크수정
        putLink: async (link) => {
            // DB 업데이트
            await req("/links/", "PUT", Object.assign(link, { linkID: link.id }));

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


        fetchList: async (menuIdx, idx = 0, cnt = 10) => {

            if(app.view.List){
                if (idx === 0) {
                    app.view.List.state.loading = true;
                    app.state.links = [];
                } else {
                    app.view.List._ismounted && app.view.List.setState({ loading: true })
                }    
            }

            let path = "/links" + app.state.menu[menuIdx].path + "?idx=" + idx + "&cnt=" + cnt;

            let fetchRes = await req(path, "GET");

            //console.log("@@ 여기서는? " + JSON.stringify(json, null, 2))

            if(app.view.List){
                app.view.List.state.loading = false;
            }

            app.state.isScrollLast = !fetchRes.hasNext;
            app.state.totalCount = fetchRes.totalCount;
            app.state.links.push(...fetchRes.links);

            return fetchRes;

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


