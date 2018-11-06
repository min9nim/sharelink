import { observable, reaction, decorate } from "mobx";
import $m from "../com/util";
import getApi from "./restful.js";


//console.log("process.env.PORT : " + process.env.PORT);
//console.log("location.hostname : " + location.hostname);

let BACKEND;

if (process.env.NODE_ENV === "production") {
    // https://cloud.google.com/appengine/docs/flexible/nodejs/runtime
    // GCP 노드 운영환경

    if(global.location){
        if (global.location.hostname === "sharelink-nextjs.appspot.com") {
            BACKEND = "https://sharelink-mongoose.appspot.com";
        } else {
            BACKEND = "https://sharelink-mongoose-dev.appspot.com";
        }   
    }
    
} else {
    let location = global.location;
    if (location) {
        // 개발환경 클라이언트
        BACKEND = location.protocol + "//" + location.hostname + ":3030"  // 모바일에서도 로컬 테스트가 가능하려면 이렇게 해야함
    } else {
        // 노드 서버에서 실행될 때
        BACKEND = "http://localhost:3030";
    }

}

console.log("Backend server : " + BACKEND);


const app = {
    $m,             // 기본 유틸
    scrollTop: 0,        // 목록화면에서 현재 스크롤 위치
    state: {
        links: [],
        totalCount: 0,
        userID: "",
        menuIdx : 0,
        isScrollLast: false,
        menu : [
            {
                label: "전체 포스트",
                path: "/links",
            },
            {
                label: "내가 등록한 포스트",
                path: "/links/my",
            },
            {
                label: "내가 좋아하는 포스트",
                path: "/links/like",
            },
            {
                label: "내가 읽은 포스트",
                path: "/links/read",
            },
            {
                label: "나중에 읽을 포스트",
                path: "/links/toread",
            }
        ]
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
        signOut: () => { },
        signIn: () => { }
    },
    view: {},          // 공유가 필요한 react 컴포넌트
    BACKEND,
    PAGEROWS: 10
};

// RESTful API 세팅
app.api = getApi(app);

decorate(app, { state: observable });

// 변화에 따른 효과를 정의
reaction(() => JSON.stringify(app.state.links), () => {
    app.view.List && app.view.List._ismounted && app.view.List.forceUpdate();
});


reaction(() => app.state.userID, async () => {
    // app.state.userID 값을 바라보며 앱의 로그인 여부를 판단한다.
    if (app.auth.isLogin()) {
        console.log("로그인 완료")
    } else {
        app.user = {
            id: "",
            name: "",
            email: "",
            image: "",
            token: ""
        };
    }

    app.view.Header && app.view.Header._ismounted && app.view.Header.forceUpdate();
    app.view.List && app.view.List._ismounted && app.view.List.forceUpdate();

});


app.isDesktop = function () {
    const os = ["win16", "win32", "win64", "mac", "macintel"];
    return os.includes(navigator.platform.toLowerCase());
}

if(global.navigator){
    app.isMobileChrome = function () {
        return !app.isDesktop() && global.navigator.userAgent.includes("Chrome");
    }    
}


global.app = app;
export default app;