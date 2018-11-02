import app from "../src/app";
import "./Menu.scss";


//console.log("### Menu.js 로드")


class Menu extends React.Component {
    constructor(props) {
        super(props);
        // console.log("@@@ Menu created..")



            // console.log("@@ document.onclick 세팅")
            global.document.onclick = (e) => {
                let clickMenu = [
                    e.target.className,
                ]
    
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
    }

    async logout() {
        await app.auth.signOut();
        this.props.hideMenu();
    }

    componentWillUnmount(){
        // console.log("@@@ Menu unmount")
        global.document.onclick = undefined;
    }

    async myLink(){
        await app.api.fetchMyLinks();
        this.props.hideMenu()
    }

    async myLike(){
        await app.api.fetchMyLike()
        this.props.hideMenu()
    }

    async myRead(){
        await app.api.fetchMyRead()
        this.props.hideMenu()
    }
    async myToread(){
        await app.api.fetchMyToread()
        this.props.hideMenu()
    }

    render() {
        return (
            <div className="menu">
                <div className="user-info">
                    <img className="user-image" src={app.user.image}></img>
                    <div className="user-name">{app.user.name}</div>
                </div>
                <div className="item">
                    <div onClick={this.myLink.bind(this)}>내가 등록한 포스트</div>
                    <div onClick={this.myLike.bind(this)}>내가 좋아하는 포스트</div>
                    <div onClick={this.myRead.bind(this)}>내가 읽었던 포스트</div>
                    <div onClick={this.myToread.bind(this)}>나중에 읽을 포스트</div>
                </div>
                <div className="item2">
                    <div onClick={this.logout.bind(this)}>로그아웃</div>
                </div>
            </div>
        )

    }
}



export default Menu;