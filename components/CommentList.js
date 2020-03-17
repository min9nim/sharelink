import React from "react";
import Comment from "./Comment";
import "./CommentList.scss";


export default class CommentList extends React.Component {
    constructor(props) {
        // console.log("CommentList 생성자 호출");
        super(props);
        
    }

    render(){
        //console.log("CommentList 렌더링..");
        return (
            <div className="CommentList">
                {this.props.comments.map(
                    c => <Comment key={c.id} comment={c} />
                )}
            </div>
        );
    }
}
