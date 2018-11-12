
import app from "../src/app";
import { withRouter } from 'next/router'
import * as Rx from 'rxjs';

import "./Search.scss";


class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: "search"
        }

        app.view.Search = this;

        // Observable 생성
        //this.text$ = new Rx.Subject();

    }

    componentDidMount() {
        this._ismounted = true;

        // Obaserver 등록
        //this.text$
        //.filter(text => text.length >= 2)
        //.map(text => text + '!')
        //.map(text => text + '!')
        // .subscribe(text => {
        //     console.log(text);
        //     app.state.word = text;
        // });
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    handleChange(e) {
        if (e.target.value.indexOf("http") === 0) {
            // 입력값이 http로 시작할 경우
            //this.setState({ mode: "add" })
            this.state.mode = "word";
        } else {
            //this.setState({ mode: "search" })
            this.state.mode = "search";
        }

        app.state.word = e.target.value;


        // 이벤트 할당
        //this.text$.next(e.target.value)
    }

    handleKeyPress(e) {
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            this.search(e.target.value);
        }
    }

    search = async (word) => {
        if (this.state.mode === "search") {
            app.api.fetchList({
                menuIdx: app.state.menuIdx,
                idx: 0,
                cnt: app.PAGEROWS,
                word
            });
        } else {
            await app.api.postLink({
                url: app.state.word,
                author: {
                    id: app.user.id,
                    name: app.user.name
                }
            });
            this.state.mode = "search"
            app.state.word = "";
        }
    }

    render() {
        console.log("Search 렌더링");
        return (
            <div className="ipt-wrapper">
                {
                    this.state.mode === "search" ?
                        <i className="icon-search" /> :
                        <i className="icon-doc-new" />
                }
                <input className="ipt-search"
                    value={app.state.word}
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)} />
            </div>
        )
    }
}

export default withRouter(Search);