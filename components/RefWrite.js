import React from "react";
// import shortid from "shortid";
import "./RefWrite.scss";


export default class RefWrite extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.saveRef = this.saveRef.bind(this);

        this.state = {
            linkID: this.props.linkID,      // 링크아이디
            url: "",
            author: {
                id: app.user.id,
                name: app.user.name
            },
        }
    }


    handleChange(e) {
        this.setState({url : e.target.value.trim()});

        if (e.target.id === "ref") {
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


    async saveRef() {

        if(!app.user.id) return;
                
        let link = await app.api.postLink(this.state);

        this.setState({ ref: "" });
        this.props.refClick();
    }
    

    handleKeyUp(e){
        if(e.keyCode === 13){
            this.saveRef()
        }
    }

    render() {
        return (
            <div className="ref-write">
                <div className="ref-wrapper">
                    <textarea id="ref"
                        ref={el => { this.input = el }}
                        value={this.state.ref}
                        onChange={this.handleChange}
                        placeholder="관련 링크입력" />
                </div>
                <div className="save-btn">
                    <button onKeyUp={this.handleKeyUp.bind(this)}>
                        <i onClick={this.saveRef} className="icon-floppy"/>
                    </button>
                </div>
            </div>
        );
    }
}
