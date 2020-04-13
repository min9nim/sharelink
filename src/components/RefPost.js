import Post from './Post'
import './RefPost.scss'

export default function RefPost(props) {
  return <Post isChild={true} {...props} />
}
