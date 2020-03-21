import ContentLoader from 'react-content-loader'

const LinkLoading = props => (
  <ContentLoader
    height={45}
    width={300}
    speed={2}
    primary-color="#f3f3f3"
    secondary-color="#ecebeb"
    {...props}
  >
    <rect x="0" y="12" rx="3" ry="3" width="230" height="6" />
    <rect x="0" y="21" rx="3" ry="3" width="200" height="6" />
    <rect x="0" y="30" rx="3" ry="3" width="70" height="6" />
  </ContentLoader>
)

export default LinkLoading
