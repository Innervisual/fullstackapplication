const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
module.exports = function createRouter(file) {
  const router = express.Router();
  let todos;
  try { todos = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    todos = ['Learn about React', 'Meet friend for lunch', 'Build really cool to-do app'].map(text => ({ id: randomUUID(), text, completed: false }));
  }
  if (!Array.isArray(todos)) throw new Error('Invalid task data');
  function save(next) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(`${file}.tmp`, JSON.stringify(next, null, 2));
    fs.renameSync(`${file}.tmp`, file); todos = next;
  }
  save(todos);
  router.get('/', (req, res) => res.json({ message: 'Todo API', endpoint: '/todos' }));
  router.get('/todos', (req, res) => res.json(todos));
  router.post('/todos', (req, res) => {
    const text = req.body?.text;
    if (typeof text !== 'string' || !text.trim() || text.trim().length > 500) return res.status(400).json({ error: 'Task text must contain 1–500 characters.' });
    const todo = { id: randomUUID(), text: text.trim(), completed: false };
    save([...todos, todo]); res.status(201).json(todo);
  });
  router.patch('/todos/:id', (req, res) => {
    const todo = todos.find(item => item.id === req.params.id);
    if (!todo) return res.status(404).json({ error: 'Task not found.' });
    if (typeof req.body?.completed !== 'boolean') return res.status(400).json({ error: 'Completed must be a boolean.' });
    const updated = { ...todo, completed: req.body.completed };
    save(todos.map(item => item.id === todo.id ? updated : item)); res.json(updated);
  });
  router.delete('/todos/:id', (req, res) => {
    if (!todos.some(item => item.id === req.params.id)) return res.status(404).json({ error: 'Task not found.' });
    save(todos.filter(item => item.id !== req.params.id)); res.sendStatus(204);
  });
  return router;
};
