import { observable, reaction, decorate } from "mobx";
import $m from "../com/util";
import getApi from "./restful.js";


//console.log("process.env.PORT : " + process.env.PORT);
//console.log("location.hostname : " + location.hostname);

let BACKEND;

if(process.env.NODE_ENV === "production"){
    // GCP 운영환경
    BACKEND = "https://sharelink-mongoose.appspot.com";
    // https://cloud.google.com/appengine/docs/flexible/nodejs/runtime
} else {
    let location = global.location;
    if(location){
        // 클라이언트에서 실행될 때
        BACKEND = location.protocol + "//" + location.hostname + ":3030"  // 모바일에서도 로컬 테스트가 가능하려면 이렇게 해야함
    }else{
        // 서버에서 실행될 때
        BACKEND = "http://localhost:3030";    
    }
    
}

console.log("Backend server : " + BACKEND);


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

    app.view.Header && app.view.Header._ismounted && app.view.Header.forceUpdate();
    app.view.List && app.view.List._ismounted && app.view.List.forceUpdate();

});


global.app = app;
export default app;