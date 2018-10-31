import { observable, reaction, decorate } from "mobx";
import fetch from 'isomorphic-unfetch';


let BACKEND;
//console.log("process.env.NODE_ENV = " + process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
    BACKEND = "http://localhost:3030";
} else {
    BACKEND = "https://sharelink-mongoose.appspot.com";
}

console.log("Backend server : " + BACKEND);


const app = {
    state: {
        links: [],
        user: {
            name: "",
            email: ""
        },
    },
    auth: {// 로그인 관련
        isLogin: () => {
            return app.user.email !== "";
        },
        signOut: () => {

        },
        signIn: () => {

        }
    },
    view: {},          // 공유가 필요한 react 컴포넌트
    BACKEND,
    api: {
        // 전체 목록 조회
        getLinks: async () => {
            let res = await fetch(app.BACKEND + "/links", {
                method: "GET"
            });
            let json = await res.json();
            app.state.links = json;
        },

        // 링크삭제
        deleteLink: async (id) => {
            let res = await fetch(app.BACKEND + "/links/" + id, {
                method: 'DELETE',
                //body: JSON.stringify(data),
            })
            //let json = await res.json();
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
        },

        // 링크수정
        putLink: async (link) => {
            let res = await fetch(app.BACKEND + "/links/" + link.id, {
                method: "PUT",
                body: JSON.stringify(link),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },

        getTitle: async (url) => {
            let res = await fetch(app.BACKEND + "/get-title", {
                method: "POST",
                body: JSON.stringify({ url }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return await res.json();
        }
    }
};

decorate(app, { state: observable });

// 변화에 따른 효과를 정의
reaction(() => JSON.stringify(app.state.links), () => {
    app.view.List && app.view.List.forceUpdate();
});


app.auth.onSiginIn = () => {
    let auth2 = gapi.auth2.getAuthInstance();
    let googleUser = auth2.currentUser.get();
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);


    app.state.user.name = profile.getGivenName();
    app.state.user.email = profile.getEmail();
}


global.app = app;
export default app;