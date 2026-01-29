import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function Layout() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  function onLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="brand">
            Task Management
          </Link>
          <nav className="nav">
            {token ? (
              <>
                <span className="muted">Hi{user?.name ? `, ${user.name}` : ''}</span>
                <button className="btn btn--ghost" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn--ghost" to="/login">
                  Login
                </Link>
                <Link className="btn btn--primary" to="/register">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
    </>
  )
}


