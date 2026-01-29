import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  apiCreateTask,
  apiDeleteTask,
  apiGetProject,
  apiListTasks,
  apiUpdateTask,
} from '../lib/api'

const PRIORITIES = ['low', 'medium', 'high']
const STATUSES = ['todo', 'in-progress', 'done']

export function ProjectPage() {
  const { token } = useAuth()
  const { projectId } = useParams()

  const [project, setProject] = useState(null)
  const [progress, setProgress] = useState({ totalTasks: 0, doneTasks: 0 })
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [status, setStatus] = useState('todo')
  const [dueDate, setDueDate] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function load() {
    setError('')
    setIsLoading(true)
    try {
      const [p, t] = await Promise.all([apiGetProject(token, projectId), apiListTasks(token, { projectId })])
      setProject(p.project)
      setProgress(p.progress)
      setTasks(t.tasks)
    } catch (err) {
      setError(err.message || 'Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const progressPct = useMemo(() => {
    if (!progress.totalTasks) return 0
    return Math.round((progress.doneTasks / progress.totalTasks) * 100)
  }, [progress])

  async function onCreateTask(e) {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    try {
      const created = await apiCreateTask(token, {
        projectId,
        title,
        description,
        priority,
        status,
        dueDate: dueDate || undefined,
      })
      setTasks((prev) => [created.task, ...prev])
      setTitle('')
      setDescription('')
      setPriority('medium')
      setStatus('todo')
      setDueDate('')
      await load()
    } catch (err) {
      setError(err.message || 'Failed to create task')
    } finally {
      setIsSaving(false)
    }
  }

  async function onQuickUpdate(task, patch) {
    setError('')
    try {
      const updated = await apiUpdateTask(token, task._id, {
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        ...patch,
      })
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated.task : t)))
      await load()
    } catch (err) {
      setError(err.message || 'Failed to update task')
    }
  }

  async function onDelete(taskId) {
    if (!confirm('Delete this task?')) return
    setError('')
    try {
      await apiDeleteTask(token, taskId)
      setTasks((prev) => prev.filter((t) => t._id !== taskId))
      await load()
    } catch (err) {
      setError(err.message || 'Failed to delete task')
    }
  }

  return (
    <div className="row">
      <div className="col">
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
            <div>
              <h1 className="title">{project ? project.name : 'Project'}</h1>
              {project?.description ? <div className="muted">{project.description}</div> : null}
              <div className="muted" style={{ marginTop: 8 }}>
                Progress: {progress.doneTasks}/{progress.totalTasks} ({progressPct}%)
              </div>
            </div>
            <Link className="btn btn--ghost" to="/">
              Back
            </Link>
          </div>

          {isLoading ? <div style={{ marginTop: 12 }}>Loading…</div> : null}
          {error ? <div className="error">{error}</div> : null}

          <div style={{ marginTop: 16 }}>
            <h2 className="title" style={{ fontSize: 18 }}>
              Tasks
            </h2>
            <div className="list">
              {tasks.map((t) => (
                <div key={t._id} className="task">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800 }}>{t.title}</div>
                      <span className="pill">{t.priority}</span>
                      <span className="pill">{t.status}</span>
                      {t.dueDate ? <span className="pill">Due: {new Date(t.dueDate).toLocaleDateString()}</span> : null}
                    </div>
                    {t.description ? <div className="muted" style={{ marginTop: 6 }}>{t.description}</div> : null}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 180 }}>
                    <select value={t.status} onChange={(e) => onQuickUpdate(t, { status: e.target.value })}>
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <select value={t.priority} onChange={(e) => onQuickUpdate(t, { priority: e.target.value })}>
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <button className="btn btn--danger" onClick={() => onDelete(t._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!isLoading && tasks.length === 0 ? <div className="muted">No tasks yet.</div> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="col">
        <div className="panel">
          <h2 className="title" style={{ fontSize: 18 }}>
            New Task
          </h2>
          <form onSubmit={onCreateTask}>
            <div className="field">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="field">
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Due date</label>
              <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" />
            </div>

            <button className="btn btn--primary" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Create task'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}


