import { withRouter } from 'next/router'
import app from "../src/app";
import "./Menu.scss";


class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            menu : app.state.menu.slice(1)
        }

        global.document.onclick = (e) => {
            let clickMenu = [e.target.className]

            if (e.target.parentNode) {
                clickMenu.push(e.target.parentNode.className);
                if (e.target.parentNode.parentNode) {
                    clickMenu.push(e.target.parentNode.parentNode.className);
                }
            }

            if (!clickMenu.includes("menu")) {
                props.hideMenu();
            }
        }

        app.view.Menu = this;
    }

    async logout() {
        await app.auth.signOut();
        this.props.hideMenu();
    }

    componentWillUnmount() {
        global.document.onclick = undefined;
    }

    selectMenu(idx) {
        return async (e) => {
            if (this.props.router.pathname === "/write") {
                this.props.router.push("/");
            }

            //let intro = e.target.innerText;
            //let intro = this.state.menu[idx].label;
            app.state.menuIdx = idx+1;
            app.state.totalCount = "?";
            app.state.isScrollLast = false;

            //await this.state.menu[idx].onSelect();
            let fetchRes = await app.api.fetchList(app.state.menu[idx+1].path);
            console.log("@@ json.totalCount = " + fetchRes.totalCount)

            this.props.hideMenu();
            //console.log("intro 세팅");
            //app.view.List.setState({ intro, selectedMenu: idx });
        }
    }


    newLink() {
        app.view.Write && app.view.Write._ismounted && Object.assign(app.view.Write.state, {
            id: "",
            url: "",
            title: "",
            desc: "",
            image: "",
            like: [],
            read: [],
            toread: [],
            author: {
                id: app.user.id,
                name: app.user.name
            }
        });
        this.props.hideMenu();
        this.props.router.push("/write");
    }


    render() {
        return (
            <div className="menu">
                <div className="user-info">
                    <img className="user-image" src={app.user.image}></img>
                    <div className="user-name">{app.user.name}</div>
                </div>
                <div className="item">
                    {/* <div onClick={this.myLink.bind(this)}>내가 등록한 포스트</div>
                    <div onClick={this.myLike.bind(this)}>내가 좋아하는 포스트</div>
                    <div onClick={this.myRead.bind(this)}>내가 읽었던 포스트</div>
                    <div onClick={this.myToread.bind(this)}>나중에 읽을 포스트</div> */}

                    {/* <div onClick={this.selectMenu(app.api.fetchMyLink)}>내가 등록한 포스트</div>
                    <div onClick={this.selectMenu(app.api.fetchMyLike)}>내가 좋아하는 포스트</div>
                    <div onClick={this.selectMenu(app.api.fetchMyRead)}>내가 읽은 포스트</div>
                    <div onClick={this.selectMenu(app.api.fetchMyToread)}>나중에 읽을 포스트</div> */}

                    {
                        this.state.menu.map((m, idx) => {
                            return (
                                <div key={idx} onClick={this.selectMenu(idx)}>{m.label}</div>
                            )
                        })
                    }

                </div>
                <div className="item2">
                    <div onClick={this.newLink.bind(this)}>등록하기</div>
                    <div onClick={this.logout.bind(this)}>로그아웃</div>
                </div>
            </div>
        )

    }
}



export default withRouter(Menu);