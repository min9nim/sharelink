import { observable, reaction, decorate } from "mobx";
import fetch from 'isomorphic-unfetch';
import $m from "../com/util";


let BACKEND;
//console.log("process.env.NODE_ENV = " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
    BACKEND = "http://localhost:3030";
} else {
    BACKEND = "https://sharelink-mongoose.appspot.com";
}

console.log("Backend server : " + BACKEND);

//let user = global.sessionStorage && JSON.parse(global.sessionStorage.getItem("user"))

const app = {
    $m,             // 기본 유틸
    scrollTop: 0,        // 목록화면에서 현재 스크롤 위치
    state: {
        links: [],
        userID: "",
    },
    user: {
        id: "",
        name: "",
        email: "",
        image: "",
        token: ""
    },
    auth: {// 로그인 관련
        isLogin: () => {
            return app.state.userID !== "";
        },
        signOut: () => {},
        signIn: () => {}
    },
    view: {},          // 공유가 필요한 react 컴포넌트
    BACKEND,
    api: {
        // 전체 목록 조회
        fetchLinks: async () => {
            //app.view.List.setState({loading: true})
            app.view.List.state.loading = true;
            app.state.links = [];
            let res = await fetch(app.BACKEND + "/links", {
                method: "GET"
            });
            let json = await res.json();
            app.view.List.state.loading = false;
            app.state.links = json;
        },

        // 링크삭제
        deleteLink: async (id) => {
            let res = await fetch(app.BACKEND + "/links/" + id, {
                method: 'DELETE',
                //body: JSON.stringify(data),
            })
            //let json = await res.json();
            app.state.links = app.state.links.filter(l => l.id !== id);
        },

        // 링크추가
        postLink: async (link) => {
            let res = await fetch(app.BACKEND + "/links", {
                method: "POST",
                body: JSON.stringify(link),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            app.state.links.push(link);
        },

        // 링크수정
        putLink: async (link) => {
            // DB 업데이트
            let res = await fetch(app.BACKEND + "/links/" + link.id, {
                method: "PUT",
                body: JSON.stringify(link),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // 로컬상태 업데이트
            var asisIdx = app.state.links.findIndex(l => l.id === link.id);
            app.state.links.splice(asisIdx, 1, link);
      
        },

        // 글작성시 글제목/글설명/글이미지 가져오기
        webscrap: async (url) => {
            let res = await fetch(app.BACKEND + "/webscrap", {
                method: "POST",
                body: JSON.stringify({ url }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return await res.json();
        },

        // 로그인처리
        login: async (token) => {
            let res = await fetch(app.BACKEND + "/login", {
                method: "POST",
                body: JSON.stringify({ token }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return await res.json();            
        },
        // 내 포스트 조회
        fetchMyLinks: async () => {
            // 목록 초기화
            app.view.List.state.loading = true;
            app.state.links = [];

            // fetch
            let res = await fetch(app.BACKEND + "/links/my/" + app.user.id, {
                method: "GET"
            });
            let json = await res.json();

            // UI 갱신
            app.view.List.state.loading = false;
            app.state.links = json;

        },

        // 내가 좋아하는 포스트
        fetchMyLike: async () => {
            // 목록 초기화
            app.view.List.state.loading = true;
            app.state.links = [];

            // fetch
            let res = await fetch(app.BACKEND + "/links/like/" + app.user.id, {
                method: "GET"
            });
            let json = await res.json();

            // UI 갱신
            app.view.List.state.loading = false;
            app.state.links = json;

        },        

        // 좋아요
        like : async (link) => {
            // DB 업데이트
            let res = await fetch(app.BACKEND + "/links/like/" + link.id, {
                method: "PUT",
                body: JSON.stringify({ userID: app.user.id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await res.json();
            //app.state.links = json;

            // 로컬상태 업데이트
            //var link = app.state.links.find(l => l.id === link.id);
            link.like.push(app.user.id);
        },
        // 좋아요 취소
        unlike : async (link) => {
            // DB 업데이트
            let res = await fetch(app.BACKEND + "/links/unlike/" + link.id, {
                method: "PUT",
                body: JSON.stringify({ userID: app.user.id}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            //let json = await res.json();
            //app.state.links = json;

            // 로컬상태 업데이트
            //var link = app.state.links.find(l => l.id === link.id);
            //let idx = link.like.indexOf(app.user.id);
            //link.like.splice(idx, 1);

            link.like = link.like.filter(userID => userID !== app.user.id);
        },        
    }
};

decorate(app, { state: observable });

// 변화에 따른 효과를 정의
reaction(() => JSON.stringify(app.state.links), () => {
    app.view.List && app.view.List.forceUpdate();
});

reaction(() => app.state.userID, async () => {
    // app.state.userID 값을 바라보며 앱의 로그인 여부를 판단한다.
    if(app.auth.isLogin()){
        console.log("로그인 완료")
    }else{
        app.user = {
            id: "",
            name: "",
            email: "",
            image: "",
            token: ""
        };
    }

    app.view.Header && app.view.Header.forceUpdate();
    app.view.List && app.view.List.forceUpdate();

});




global.app = app;
export default app;