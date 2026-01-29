import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row">
      <div className="col">
        <div className="panel">
          <h1 className="title">Register</h1>
          <p className="muted">Create an account to start tracking your tasks.</p>

          <form onSubmit={onSubmit}>
            <div className="field">
              <label>Name (optional)</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Navin" />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            </div>
            <div className="field">
              <label>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            </div>

            <button className="btn btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Register'}
            </button>
            {error ? <div className="error">{error}</div> : null}
          </form>

          <p className="muted" style={{ marginTop: 12 }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}


