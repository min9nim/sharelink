import Header from './Header'

const Layout = (props) => (
  <div className="layoutStyle">
    <Header />
    {props.children}

    <style jsx>{`
    .layoutStyle {
      margin: 0px auto;
      padding: 0px 15px;
      max-width: 1000px;
    }

  `}</style>    
  </div>
)

export default Layout