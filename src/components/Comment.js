import React from 'react'
import moment from 'moment'
import $m from '../com/util.js'

import './Comment.scss'
import { toJS } from 'mobx'

export default class Comment extends React.Component {
  constructor(props) {
    // console.log("Comment 생성자 호출");
    super(props)
    //this.deleteComment = this.deleteComment.bind(this);
    this.state = {
      editClicked: false,
      comment: this.props.comment.comment,
    }
  }

  async delete(comment, dom) {
    if (confirm('댓글을 삭제합니다')) {
      //await $m.removeAnimation(dom, 0.2);
      $m.removeAnimation(dom, 0.2)

      let res = await app.api.deleteComment(comment)
      if (res.status === 'Fail') {
        $m.cancelRemoveAnimation(dom, 0.2)
      }
    }
  }

  async edit() {
    this.setState(
      {
        editClicked: !this.state.editClicked,
      },
      () => {
        // textarea 높이 조정
        if (this.state.editClicked) {
          this.textarea.style.height =
            this.textarea.scrollHeight > 20
              ? this.textarea.scrollHeight + 'px'
              : '20px'
        }
      },
    )
  }

  async editComment() {
    await app.api.putComment(
      Object.assign({}, this.props.comment, { comment: this.state.comment }),
    )
    this.setState({
      editClicked: false,
    })
  }

  handleChange(e) {
    let state = {}
    state[e.target.id] = e.target.value
    this.setState(state)

    if (e.target.id === 'comment') {
      // https://zetawiki.com/wiki/HTML_textarea_자동_높이_조절
      //console.log("e.target.scrollHeight = " + e.target.scrollHeight);
      e.target.style.height =
        e.target.scrollHeight > 20 ? e.target.scrollHeight + 'px' : '20px'
    }
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.editComment()
    }
  }

  render() {
    // console.log("Comment 렌더링");

    const { comment, author, updatedAt } = this.props.comment

    return (
      <div
        className="comment"
        ref={(el) => {
          this.dom = el
        }}
      >
        <div>
          <div className="meta">
            {author.name} - {moment(updatedAt).format('MM/DD dd HH:mm')}
          </div>
          {this.props.comment.author.id === app.user.id && (
            <div className="comment-menu">
              <div className="edit" onClick={this.edit.bind(this)}>
                수정
              </div>
              <div>|</div>
              <div
                className="delete"
                onClick={() => this.delete(this.props.comment, this.dom)}
              >
                삭제
              </div>
            </div>
          )}
        </div>
        {this.state.editClicked ? (
          <div className="form">
            <textarea
              id="comment"
              onChange={this.handleChange.bind(this)}
              ref={(el) => {
                this.textarea = el
              }}
              value={this.state.comment}
            >
              {comment}
            </textarea>
            <div className="save-btn">
              <button onKeyUp={this.handleKeyUp.bind(this)}>
                <i
                  onClick={this.editComment.bind(this)}
                  className="icon-floppy"
                />
              </button>
            </div>
          </div>
        ) : (
          <div className="content">
            <pre>{comment}</pre>
          </div>
        )}
      </div>
    )
  }
}
