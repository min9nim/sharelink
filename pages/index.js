import Layout from '../comps/Layout.js';
import Post from '../comps/Post.js';
import LinkLoading from '../comps/LinkLoading.js';

import app from "../src/app";
import "./index.scss";

export default class List extends React.Component {
  constructor(props){
    super(props);
    app.view.List = this;
    this.state = {
      loading: false
    }

    this.state.loading = true;
    app.api.getLinks().then(() => this.setState({loading: false}));
  }

  render() {
    return (
      <Layout>
      <ul>
        {app.state.links.reverse().map((link) => (
          <Post key={link.id} link={link}/>
        ))}
        {this.state.loading && new Array(5).fill().map((v,i) => <LinkLoading key={i}/>)}
      </ul>
    </Layout>
    )
  }
}
