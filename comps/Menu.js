import app from "../src/app";
import "./Menu.scss";


//console.log("### Menu.js 로드")


const Menu = (props) => {
    function logout() {
        app.auth.signOut();
        props.hideMenu();
    }
    //console.log("@@@ Menu render")

    if (global.document && !global.document.onclick) {
        console.log("@@ document.onclick 세팅")
        global.document.onclick = (e) => {
            let clickMenu = [
                e.target.className,
            ]

            if(e.target.parentNode){
                clickMenu.push(e.target.parentNode.className);
                if(e.target.parentNode.parentNode){
                    clickMenu.push(e.target.parentNode.parentNode.className);
                }
            }

            clickMenu.includes("menu");

            if (!clickMenu) {
                props.hideMenu();
            }
        }
    }



    return (
        <div className="menu">
            <div className="user-info">
                <img className="user-image" src={app.user.image}></img>
                <div className="user-name">{app.user.name}</div>
            </div>
            <div className="item">
                <div>내 포스트</div>
                <div>내가 좋아하는 포스트</div>
                <div>내가 읽었던 포스트</div>
                <div>나중에 읽을 포스트</div>
                <div onClick={logout}>로그아웃</div>
            </div>
        </div>
    )

}

export default Menu;