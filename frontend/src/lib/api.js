const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`
    throw new Error(message)
  }
  return data
}

export function apiRegister({ name, email, password }) {
  return request('/auth/register', { method: 'POST', body: { name, email, password } })
}

export function apiLogin({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export function apiListProjects(token) {
  return request('/projects', { token })
}

export function apiCreateProject(token, { name, description }) {
  return request('/projects', { method: 'POST', token, body: { name, description } })
}

export function apiGetProject(token, projectId) {
  return request(`/projects/${projectId}`, { token })
}

export function apiDeleteProject(token, projectId) {
  return request(`/projects/${projectId}`, { method: 'DELETE', token })
}

export function apiListTasks(token, { projectId } = {}) {
  const qs = projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''
  return request(`/tasks${qs}`, { token })
}

export function apiCreateTask(token, payload) {
  return request('/tasks', { method: 'POST', token, body: payload })
}

export function apiUpdateTask(token, taskId, payload) {
  return request(`/tasks/${taskId}`, { method: 'PUT', token, body: payload })
}

export function apiDeleteTask(token, taskId) {
  return request(`/tasks/${taskId}`, { method: 'DELETE', token })
}

export function apiDashboardStats(token) {
  return request('/tasks/stats/dashboard', { token })
}


