import Link from 'next/link';

const Header = () => (
  <div className="headerStyle">
    <div className="logo">
      <Link href="/">
        <a className="linkStyle">Sharelink</a>
      </Link>
    </div>
    <div>
      <Link href="/write">
        <a className="linkStyle">등록</a>
      </Link>
    </div>

    <style jsx>{`
      .headerStyle {
        border-bottom: 1px solid #DDD;
        display: flex;
      }
      .linkStyle{
      margin-right: 15px;
      }
      .logo {
        flex: 1;
        font-size: 20px;
      }

      a:-webkit-any-link {
        text-decoration: none;
      }      
  `}</style>
  </div>
)

export default Header