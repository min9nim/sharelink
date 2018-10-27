import Link from 'next/link';
import app from '../src/app';


const remove = async (post) => {
    if(!confirm("삭제합니다")){
        return;
    }
    app.api.deleteLink(post.id);
    app.state.links = app.state.links.filter(l => l.id !== post.id);
}

const Post = ({ link }) => (
    <li>
        <div className="title">
            <a href={link.url} target="_blank">{link.title}</a>
        </div>
        <div className="url">
            <a href={link.url} target="_blank">{link.url}</a>
        </div>
        <div className="post-menu">
            <Link href={`/write?id=${link.id}`}><div>수정</div></Link>
            <div onClick={()=>remove(link)}>삭제</div>
        </div>
        <style jsx>{`
      li {
        list-style: none;
        margin: 20px 0;
      }

      .title {
        color: green;
        font-size: 22px;
      }

      .title a:-webkit-any-link {
         color: #333;
      }

      a {
        text-decoration: none;
        font-family: "Arial";
      }

      a:hover {
        opacity: 0.6;
      }

      .post-menu {
        margin-top: 5px;
        display: flex;
      }
      .post-menu div {
        color: #555;
        font-size: 14px;
        width: 40px;
        cursor: pointer;
      }

    `}</style>
    </li>
)

export default Post;