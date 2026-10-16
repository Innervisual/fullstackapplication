import './App.css';
import React, { useEffect, useState } from 'react';
async function request(path = '', options = {}) {
  const response = await fetch(`/todos${path}`, { ...options, headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) throw new Error('Could not load or save tasks. Check that the backend is running.');
  return response.status === 204 ? null : response.json();
}
export default function App() {
  const [todos, setTodos] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    request().then(data => { if (active) setTodos(data); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function mutate(action) {
    setBusy(true); setError('');
    try { await action(); } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  function addTodo(event) {
    event.preventDefault();
    const text = value.trim();
    if (!text || busy || loading) return;
    mutate(async () => {
      const todo = await request('', { method: 'POST', body: JSON.stringify({ text }) });
      setTodos(current => [...current, todo]); setValue('');
    });
  }
  return <main className="app">
    <h1>My tasks</h1>
    {loading && <p role="status">Loading tasks…</p>}
    {error && <p role="alert">{error}</p>}
    <ul className="todo-list">{todos.map(todo => <li className="todo" key={todo.id}>
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
      <div>
        <button disabled={busy} onClick={() => mutate(async () => {
          const updated = await request(`/${todo.id}`, { method: 'PATCH', body: JSON.stringify({ completed: !todo.completed }) });
          setTodos(current => current.map(item => item.id === todo.id ? updated : item));
        })}>{todo.completed ? 'Undo' : 'Complete'}</button>
        <button disabled={busy} aria-label={`Delete ${todo.text}`} onClick={() => mutate(async () => {
          await request(`/${todo.id}`, { method: 'DELETE' });
          setTodos(current => current.filter(item => item.id !== todo.id));
        })}>Delete</button>
      </div>
    </li>)}</ul>
    {!loading && !error && todos.length === 0 && <p>No tasks yet.</p>}
    <form onSubmit={addTodo}>
      <label htmlFor="new-todo">New task</label>
      <input id="new-todo" value={value} maxLength={500} disabled={busy || loading} onChange={event => setValue(event.target.value)} />
      <button disabled={busy || loading || !value.trim()} type="submit">Add task</button>
    </form>
  </main>;
}
