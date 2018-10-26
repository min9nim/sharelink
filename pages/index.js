import Layout from '../comps/Layout.js';
import Post from '../comps/Post.js';

import app from "../src/app";

export default class List extends React.Component {
  constructor(props){
    super(props);
    app.view.List = this;
  }

  render() {
    return (
      <Layout>
      <ul>
        {app.state.links.map((link) => (
          <Post key={link.id} link={link}/>
        ))}
      </ul>
      <style jsx>{`
        ul {
          padding: 0;
        }
      `}</style>
    </Layout>
    )
  }
}
