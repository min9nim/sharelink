import { observable, reaction, decorate } from "mobx";
import fetch from 'isomorphic-unfetch';


let BACKEND;
//console.log("process.env.NODE_ENV = " + process.env.NODE_ENV);
if(process.env.NODE_ENV === "development"){
    BACKEND = "http://localhost:3030";
}else{
    //BACKEND = "https://sharelink-backend.now.sh";
    BACKEND = "https://sharelink-backend.appspot.com";
}

//BACKEND = "https://sharelink-backend.appspot.com";

console.log("Backend server : " + BACKEND);


const app = {
    state : {
        links: [],
    },
    view : {},          // 공유가 필요한 react 컴포넌트
    BACKEND,
    api: {
        // 전체 목록 조회
        getLinks : async () => {
            let res = await fetch(app.BACKEND + "/links", {
                method: "GET"
            });
            let json = await res.json();
            app.state.links = json;
        },

        // 링크삭제
        deleteLink : async (id) => {
            let res = await fetch(app.BACKEND + "/links/" + id, {
                method: 'DELETE',
                //body: JSON.stringify(data),
            })
            //let json = await res.json();
        },

        // 링크추가
        postLink : async (link) => {
            let res = await fetch(app.BACKEND + "/links", {
                method : "POST",
                body: JSON.stringify(link),
                headers:{
                  'Content-Type': 'application/json'
                }
            });
        },

        // 링크수정
        putLink : async (link) => {
            let res = await fetch(app.BACKEND + "/links/" + link.id, {
                method : "PUT",
                body: JSON.stringify(link),
                headers:{
                  'Content-Type': 'application/json'
                }
            });
        },

        getTitle : async (url) => {
            let res = await fetch(app.BACKEND + "/get-title", {
                method : "POST",
                body : JSON.stringify({url}),
                headers:{
                  'Content-Type': 'application/json'
                }
            })
            return await res.json();
        }
    }
};

decorate(app, {state: observable});

// 변화에 따른 효과를 정의
reaction(() => JSON.stringify(app.state.links), () => {
    app.view.List && app.view.List.forceUpdate();
});

global.app = app;
export default app;
