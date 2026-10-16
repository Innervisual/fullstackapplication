# Todo fullstack application

A small, single-user todo app with a React frontend and an Express API.

## Run locally

Use Node.js 22 or newer. Install dependencies first:

```sh
npm ci --prefix todo-backend
npm ci --prefix fullstackjp
```

Start the backend in one terminal:

```sh
npm start --prefix todo-backend
```

Start the frontend in a second terminal:

```sh
npm start --prefix fullstackjp
```

Open http://localhost:3000. The frontend development server forwards `/todos`
requests to the backend on port 5000; the legacy `API_server` is not required.
You can add, complete, undo, and delete tasks. Blank tasks are rejected.
Tasks are saved to `todo-backend/data/todos.json` and survive refreshes and
backend restarts. Set `TODO_DATA_FILE` to use a different data file.

This is a local single-user demo without authentication. The backend binds
only to 127.0.0.1 by default. A public deployment needs authentication and HTTPS.
A production frontend needs a reverse proxy forwarding `/todos` to the backend.

## Verify

```sh
npm test --prefix todo-backend
npm test --prefix fullstackjp -- --watchAll=false
npm run build --prefix fullstackjp
```

## Docker backend

Build from `todo-backend`. Set `HOST=0.0.0.0` inside the container and mount a
persistent volume at `/app/data` to keep tasks when replacing the container.
