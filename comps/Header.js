import Link from 'next/link';
import "./Header.scss";

const Header = () => (
  <div className="header">
    <div className="logo-wrapper">
      <Link href="/">
        <div className="logo"><img src="/static/logo.png"></img></div>
      </Link>
    </div>
    <div className="btn-wrapper">
      <Link href="/write">
        <div className="add-btn">등록</div>
      </Link>
    </div>
  </div>
)

export default Header