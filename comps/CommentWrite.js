import React from "react";
import shortid from "shortid";
import "./CommentWrite.scss";


export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.saveComment = this.saveComment.bind(this);


        this.state = {
            id: "",
            linkID: this.props.linkID,      // 링크아이디
            commentKey: "",              // 부모 코멘트 id
            comment: "",                // 내용
            author: {
                id: app.user.id,
                name: app.user.name
            },

            createAt: "",                   // 작성시간
            updatedAt: ""
        }
    }


    handleChange(e) {
        let state = {};
        state[e.target.id] = e.target.value;
        this.setState(state);

        if (e.target.id === "comment") {
            // https://zetawiki.com/wiki/HTML_textarea_자동_높이_조절
            //console.log("e.target.scrollHeight = " + e.target.scrollHeight);
            e.target.style.height = e.target.scrollHeight > 20
                ? (e.target.scrollHeight + "px")
                : "20px";
        }
    }

    componentDidMount() {
        this.input.focus();
    }

    async saveComment() {
        //let comment = Object.assign({}, this.state, {id : shortid.generate()});
        //app.api.postComment(comment);

        await app.api.postComment(this.state);
        this.setState({ comment: "" });
        this.props.commentClick();
    }

    render() {
        return (
            <div className="comment-write">
                <div className="comment-wrapper">
                    <textarea id="comment"
                        ref={el => { this.input = el }}
                        value={this.state.comment}
                        onChange={this.handleChange}
                        placeholder="댓글입력" />
                </div>
                <div className="save-btn">
                    <i onClick={this.saveComment} className="icon-floppy" tabIndex="1"/>
                </div>
            </div>
        );
    }
}
