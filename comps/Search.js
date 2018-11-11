
import app from "../src/app";
import { withRouter } from 'next/router'

import "./Search.scss";


class Search extends React.Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     word: ""
        // }

        app.view.Search = this;

    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted = false;
    }

    handleChange(e) {
        app.state.word = e.target.value;
        //this.search(e.target.value);
        // this.setState({
        //     word: e.target.value
        // })
    }

    handleKeyPress(e) {
        let keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            this.search(e.target.value);
        }
    }

    search(word) {
        app.api.fetchList({
            menuIdx: app.state.menuIdx,
            idx: 0,
            cnt: app.PAGEROWS,
            word
        });
    }

    render() {
        console.log("Search 렌더링");
        return (
            <div className="ipt-wrapper">
                <i className="icon-search" />
                <input className="ipt-search"
                    value={app.state.word}
                    onChange={this.handleChange.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)} />
            </div>
        )
    }
}

export default withRouter(Search);