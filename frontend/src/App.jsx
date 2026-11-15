import { useEffect, useState } from 'react'
import './App.css'

const API = '/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  // Load tasks once when the page opens
  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error('Could not load tasks')
        return res.json()
      })
      .then((data) => setTasks(data))
      .catch(() => setError('Backend se connect nahi ho saka. Kya API chal rahi hai?'))
      .finally(() => setLoading(false))
  }, [])

  async function addTask(e) {
    e.preventDefault()
    if (!title.trim()) return
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    })
    if (!res.ok) {
      setError('Task add nahi ho saka')
      return
    }
    const newTask = await res.json()
    setTasks([newTask, ...tasks])
    setTitle('')
    setDescription('')
    setError('')
  }

  async function toggleTask(task) {
    const res = await fetch(`${API}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    })
    if (!res.ok) return setError('Task update nahi ho saka')
    const updated = await res.json()
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
  }

  async function deleteTask(id) {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (!res.ok) return setError('Task delete nahi ho saka')
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const visibleTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const pendingCount = tasks.filter((t) => !t.completed).length

  return (
    <div className="container">
      <h1>Task Tracker</h1>
      <p className="subtitle">{pendingCount} pending, {tasks.length} total</p>

      <form onSubmit={addTask} className="add-form">
        <input
          type="text"
          placeholder="Task title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="filters">
        {['all', 'pending', 'completed'].map((f) => (
          <button
            key={f}
            className={filter === f ? 'active' : ''}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : visibleTasks.length === 0 ? (
        <p className="empty">Koi task nahi.</p>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
            <li key={task.id} className={task.completed ? 'done' : ''}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
              <div className="task-text">
                <strong>{task.title}</strong>
                {task.description && <span>{task.description}</span>}
                <small>{new Date(task.created_at).toLocaleString()}</small>
              </div>
              <button className="delete" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App