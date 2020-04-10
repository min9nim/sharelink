import ContentLoader from 'react-content-loader'

export default function LinkLoading(props) {
  return (
    <div>
      <ContentLoader
        uniqueKey="helloWorld"
        height={65}
        width={300}
        speed={2}
        primary-color="#f3f3f3"
        secondary-color="#ecebeb"
      >
        <rect x="0" y="12" rx="3" ry="3" width="230" height="6" />
        <rect x="0" y="21" rx="3" ry="3" width="200" height="6" />
        <rect x="0" y="30" rx="3" ry="3" width="70" height="6" />
      </ContentLoader>
    </div>
  )
}
