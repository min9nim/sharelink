import React from "react";
import moment from "moment";

import "./Comment.scss";

export default class Comment extends React.Component {
    constructor(props) {
        // console.log("Comment 생성자 호출");
        super(props);
        //this.deleteComment = this.deleteComment.bind(this);
    }


    delete = async (comment) => {
        if(confirm("삭제합니다")){
            app.api.deleteComment(comment);
        }
    }


    render() {
        // console.log("Comment 렌더링");

        const { comment, author, updatedAt } = this.props.comment;



        return (
            <div className="comment">
                <div>
                    <div className="meta">
                        {author.name} - {moment(updatedAt).format('MM/DD dd HH:mm')}
                    </div>
                    <div className="btn">
                        <div className="edit">수정</div>
                        <div>|</div>
                        <div className="delete" onClick={() => this.delete(this.props.comment)}>삭제</div>
                    </div>
                </div>
                {/*댓글에서 새줄표시 <br> 처리하기 위해 html을 사용할 수 있어야 함*/}
                <div className="content" >{comment}</div>
            </div>
        );
    }
}
