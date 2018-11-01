import Link from 'next/link';
import app from '../src/app';
import URL from "url-parse";
import moment from "moment";

import "./Post.scss";


const remove = async (post) => {
  if (!confirm("삭제합니다")) {
    return;
  }
  app.api.deleteLink(post.id);
  app.state.links = app.state.links.filter(l => l.id !== post.id);
}

const Post = ({ link }) => {
  let { hostname } = new URL(link.url);


  // console.log(link.author.id);
  // console.log(app.user.id)
  // console.log(link.author.id === app.user.id);

  return (
    <li>
      <div className="wrapper">
        <div className="left">
          <div className="title">
            <a href={link.url} target="_blank">{link.title}</a>
          </div>
          <div className="meta">
            <div className="url">{hostname}</div>
            <div className="author-name">{link.author && " | by " + link.author.name}</div>
            <div className="updatedAt">{link.updatedAt && "| " + moment(link.updatedAt).fromNow()}</div>
          </div>
          <div className="desc">
            {link.desc}
          </div>
          <div className="post-menu">
          <div className="like-btn" title="좋아요">
                <i className="icon-thumbs-up" />
          </div>          
          <div className="read-btn" title="읽음표시">
                <i className="icon-ok" />
          </div>          
          <div className="toread-btn" title="읽을 글 표시">
                <i className="icon-basket" />
          </div>      
          <div className="comment-btn" title="댓글">
                <i className="icon-comment-empty" />
          </div>      

          

          {
            (link.author.id === app.user.id)
            &&
            <React.Fragment>
              <Link href={`/write?id=${link.id}`}>
                <div className="edit-btn" title="수정"><i className="icon-pencil" />수정</div>
              </Link>
              <div className="delete-btn" title="삭제" onClick={() => remove(link)}>
                <i className="icon-trash-empty" />삭제
              </div>
              </React.Fragment>
          }
          </div>

        </div>
        <div className="right">
          <img src={link.image}></img>
        </div>
      </div>
    </li>
  )
}

export default Post;