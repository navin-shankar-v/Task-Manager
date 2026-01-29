import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { apiCreateProject, apiDashboardStats, apiListProjects } from '../lib/api'

export function DashboardPage() {
  const { token } = useAuth()
  const [projects, setProjects] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  async function load() {
    setError('')
    setIsLoading(true)
    try {
      const [p, s] = await Promise.all([apiListProjects(token), apiDashboardStats(token)])
      setProjects(p.projects)
      setStats(s)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'Total tasks', value: stats.totalTasks },
      { label: 'Completed', value: stats.completedTasks },
      { label: 'Pending', value: stats.pendingTasks },
    ]
  }, [stats])

  async function onCreateProject(e) {
    e.preventDefault()
    setError('')
    setIsCreating(true)
    try {
      const created = await apiCreateProject(token, { name: newName, description: newDesc })
      setProjects((prev) => [created.project, ...prev])
      setNewName('')
      setNewDesc('')
    } catch (err) {
      setError(err.message || 'Failed to create project')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="row">
      <div className="col">
        <div className="panel">
          <h1 className="title">Dashboard</h1>
          <p className="muted">Overview of your tasks and projects.</p>

          {isLoading ? <div>Loading…</div> : null}
          {error ? <div className="error">{error}</div> : null}

          {!isLoading && stats ? (
            <>
              <div className="grid" style={{ marginTop: 12 }}>
                {cards.map((c) => (
                  <div key={c.label} className="card">
                    <div className="muted">{c.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{c.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid" style={{ marginTop: 12 }}>
                <div className="card">
                  <div className="card__title">By priority</div>
                  <div className="muted">
                    Low: {stats.byPriority.low} · Medium: {stats.byPriority.medium} · High: {stats.byPriority.high}
                  </div>
                </div>
                <div className="card">
                  <div className="card__title">By status</div>
                  <div className="muted">
                    Todo: {stats.byStatus.todo} · In progress: {stats.byStatus.inProgress} · Done: {stats.byStatus.done}
                  </div>
                </div>
                <div className="card">
                  <div className="card__title">Projects</div>
                  <div className="muted">{projects.length} total</div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <h2 className="title" style={{ fontSize: 18 }}>
            Create Project
          </h2>
          <form onSubmit={onCreateProject}>
            <div className="field">
              <label>Name</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </div>
            <button className="btn btn--primary" disabled={isCreating}>
              {isCreating ? 'Creating…' : 'Create'}
            </button>
          </form>
        </div>

        <div className="panel" style={{ marginTop: 16 }}>
          <h2 className="title" style={{ fontSize: 18 }}>
            Your Projects
          </h2>
          <div className="list">
            {projects.map((p) => (
              <div key={p._id} className="card">
                <div className="card__title">{p.name}</div>
                {p.description ? <div className="muted">{p.description}</div> : null}
                <div style={{ marginTop: 10 }}>
                  <Link className="btn btn--ghost" to={`/projects/${p._id}`}>
                    Open
                  </Link>
                </div>
              </div>
            ))}
            {!isLoading && projects.length === 0 ? <div className="muted">No projects yet.</div> : null}
          </div>
        </div>
      </div>
    </div>
  )
}


