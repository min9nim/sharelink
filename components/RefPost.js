import Post from './Post'
import './RefPost.scss'

export default function (props) {
  return <Post isChild={true} {...props} />
}
