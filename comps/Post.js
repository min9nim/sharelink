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


  console.log(link.author.id);
  console.log(app.user.id)
  console.log(link.author.id === app.user.id);

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
          {
            (link.author.id === app.user.id)
            &&
            <div className="post-menu">
              <Link href={`/write?id=${link.id}`}><div><button>수정</button></div></Link>
              <div onClick={() => remove(link)}><button>삭제</button></div>
            </div>
          }

        </div>
        <div className="right">
          <img src={link.image}></img>
        </div>
      </div>
    </li>
  )
}

export default Post;