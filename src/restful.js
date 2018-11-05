import fetch from 'isomorphic-unfetch';

const req = async (path, method, body) => {
    global.NProgress && global.NProgress.start();
    let res = await fetch(app.BACKEND + path, {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    })
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
            await req("/links/" + link.id, "PUT", link);

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
        login: async (token) => {
            let json = await req("/login", "POST", { token })
            return json;
        },



        // 전체 목록 조회
        fetchLinks: async ({ idx, cnt } = {idx:0, cnt:10}) => {
            return app.api.fetchList("/links", idx, cnt);
        },


        fetchList : async (path, idx=0, cnt=10) => {
            let json;

            if(idx === 0){
                app.view.List.state.loading = true;
                app.state.links = [];
            }else{
                app.view.List._ismounted && app.view.List.setState({loading: true})
            }
            
            json = await req(path + "?idx=" + idx + "&cnt=" + cnt, "GET");
            app.view.List.state.loading = false;
            //app.state.links = app.state.links.concat(json);
            app.state.links.push(...json);
            return json;

            // if (idx === 0) {
            //     app.view.List.state.loading = true;
            //     app.state.links = [];
            //     json = await req(path, "GET");
            //     app.view.List.setState({ loading: false });
            //     app.state.links = json;
            // } else {
            //     app.view.List.state.loading = true;
            //     json = await req(path + "?idx=" + idx + "&cnt=" + cnt, "GET");
            //     app.view.List.state.loading = false;
            //     app.state.links.push(json);
            // }            
        },


        // 내 포스트 조회
        fetchMyLink: async () => {
            // 목록 초기화
            app.view.List.state.loading = true;
            app.state.links = [];

            // fetch
            let json = await req("/links/my/" + app.user.id, "GET");

            // UI 갱신
            //app.view.List.state.loading = false;
            app.view.List.setState({ loading: false });
            app.state.links = json;

        },

        // 내가 좋아하는 포스트
        fetchMyLike: async () => {
            // 목록 초기화
            app.state.links = [];
            app.view.List.setState({ loading: true })
            //app.view.List.state.loading = true;


            // fetch
            let json = await req("/links/like/" + app.user.id, "GET");

            // UI 갱신
            app.view.List.setState({ loading: false })
            //app.view.List.state.loading = false;
            app.state.links = json;

        },

        // 내가 읽었던 포스트
        fetchMyRead: async () => {
            // 목록 초기화
            app.view.List.state.loading = true;
            app.state.links = [];

            // fetch
            let json = await req("/links/read/" + app.user.id, "GET");

            // UI 갱신
            //app.view.List.state.loading = false;
            app.view.List.setState({ loading: false })
            app.state.links = json;
        },

        // 나중에 읽을 포스트
        fetchMyToread: async () => {
            // 목록 초기화
            app.view.List.state.loading = true;
            app.state.links = [];

            // fetch
            let json = await req("/links/toread/" + app.user.id, "GET");

            // UI 갱신
            //app.view.List.state.loading = false;
            app.view.List.setState({ loading: false });
            app.state.links = json;
        },







        // 좋아요
        like: async (link) => {
            // DB 업데이트
            await req("/links/like/" + link.id, "PUT", { userID: app.user.id });

            // 로컬상태 업데이트
            link.like.push(app.user.id);
        },
        // 좋아요 취소
        unlike: async (link) => {
            // DB 업데이트
            let res = await req("/links/unlike/" + link.id, "PUT", { userID: app.user.id });

            // 로컬상태 업데이트
            link.like = link.like.filter(userID => userID !== app.user.id);
        },
        // 읽음 표시
        read: async (link) => {
            // DB 업데이트
            let res = await req("/links/read/" + link.id, "PUT", { userID: app.user.id });

            // 로컬상태 업데이트
            link.read.push(app.user.id);
        },
        // 읽음표시 취소
        unread: async (link) => {
            // DB 업데이트
            await req("/links/unread/" + link.id, "PUT", { userID: app.user.id });

            // 로컬상태 업데이트
            link.read = link.read.filter(userID => userID !== app.user.id);
        },
        // 읽을 글 표시
        toread: async (link) => {
            // DB 업데이트
            await req("/links/toread/" + link.id, "PUT", { userID: app.user.id });

            // 로컬상태 업데이트
            link.toread.push(app.user.id);
        },
        // 읽을 글 표시 취소
        untoread: async (link) => {
            // DB 업데이트
            await req("/links/untoread/" + link.id, "PUT", { userID: app.user.id });

            // 로컬상태 업데이트
            link.toread = link.toread.filter(userID => userID !== app.user.id);
        },
    };
};


