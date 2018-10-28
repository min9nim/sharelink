import Link from 'next/link';
import app from '../src/app';
import "./Post.scss";


const remove = async (post) => {
  if (!confirm("삭제합니다")) {
    return;
  }
  app.api.deleteLink(post.id);
  app.state.links = app.state.links.filter(l => l.id !== post.id);
}

const Post = ({ link }) => (
  <li>
    <div className="wrapper">
      <div className="left">
        <div className="title">
          <a href={link.url} target="_blank">{link.title}</a>
        </div>
        <div className="url">
          <a href={link.url} target="_blank">{link.url}</a>
        </div>
        <div className="post-menu">
          <Link href={`/write?id=${link.id}`}><div>수정</div></Link>
          <div onClick={() => remove(link)}>삭제</div>
        </div>
      </div>
      <div className="right">
        <img src={link.image}></img>
      </div>
    </div>
  </li>
)

export default Post;