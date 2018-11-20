import React from "react";
import RefPost from "./RefPost";
import "./RefPostList.scss";


export default class RefPostList extends React.Component {
    constructor(props) {
        // console.log("RefPostList 생성자 호출");
        super(props);
    }

    render() {
        return (
            <ul className="RefPostList">
                {this.props.refLinks.map(
                    l => <RefPost key={l.id} link={l} />
                )}
            </ul>
        );
    }
}
