import { withRouter } from 'next/router'
import app from '../biz/app'
import './Menu.scss'
import { menuOutClick } from './Menu-fn'
import { useEffect } from 'react'

function Menu(props) {
  async function logout() {
    await app.auth.signOut()
    props.hideMenu()
  }
  useEffect(() => {
    document.onclick = menuOutClick(props.hideMenu)
    return () => {
      document.onclick = null
    }
  }, [])

  function selectMenu(idx) {
    return () => {
      app.state.links = []
      app.state.menuIdx = idx + 1
      app.state.totalCount = '?'

      props.router.push(app.state.menu[idx + 1].path)
      props.hideMenu()
    }
  }
  return (
    <div className="menu">
      <div className="user-info">
        <img className="user-image" src={app.state.user.image}></img>
        <div className="user-name">{app.state.user.name}</div>
      </div>
      <div className="item">
        {app.state.menu.slice(1).map((m, idx) => (
          <div key={idx} onClick={selectMenu(idx)}>
            {m.label}
          </div>
        ))}
      </div>
      <div className="item2">
        <div onClick={props.newLink}>등록하기</div>
        <div onClick={logout}>로그아웃</div>
      </div>
    </div>
  )
}

export default withRouter(Menu)
