const express = require('express');
const path = require('node:path');
const createRouter = require('./routes/index');
module.exports = function createApp(file = process.env.TODO_DATA_FILE || path.join(__dirname, 'data', 'todos.json')) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.use('/', createRouter(file));
  app.use((req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: status < 500 ? 'Invalid request.' : 'Unable to process request.' });
  });
  return app;
};
