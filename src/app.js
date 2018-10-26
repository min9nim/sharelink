import { observable, reaction, decorate } from "mobx";


const app = {
    state : {
        links: [
            { id: 'hello-nextjs', title: 'Hello Next.js', url: "http://paulgraham.com/head.html"},
            { id: 'learn-nextjs', title: 'Learn Next.js is awesome', url: "http://daum.net"},
            { id: 'learn-nextjs2', title: 'Learn Next.js is awesome', url: "http://daum1.net"},
            { id: 'learn-nextjs3', title: 'Learn Next.js is awesome', url: "http://daum2.net"},
            { id: 'learn-nextjs4', title: 'Learn Next.js is awesome', url: "http://daum3.net"},
            { id: 'deploy-nextjs', title: 'Deploy apps with ZEIT', url: "https://anony-212509.appspot.com/inswave"},
        ],
    },
    view : {}

};

decorate(app, {state: observable});

// 변화에 따른 효과를 정의
reaction(() => app.state.links.length, () => {
    app.view.List.forceUpdate();
});

global.app = app;

export default app;
