# AI Agent Developer Guide: Todo Full-Stack Application

This document provides guidance for an AI agent tasked with developing and improving the "Todo" full-stack application. It summarizes the codebase structure, identifies key vulnerabilities, and outlines a path for improvements.

## 1. Project Overview

*   **Description**: The "Todo" application is a full-stack project designed to manage a list of tasks. Users should be able to add, view, and delete items.
*   **Architecture**: The current architecture consists of three main components:
    1.  `fullstackjp`: A React-based frontend.
    2.  `API_server`: An Express.js server intended as a proxy between the frontend and the backend.
    3.  `todo-backend`: An Express.js server acting as the main backend API.
    *   The current interaction flow is: `fullstackjp` -> `API_server` -> `todo-backend`.
*   **Note on `API_server`**: Its necessity is questionable for the current scale and functionality. It adds complexity and an extra network hop with minimal benefit. A key decision will be whether to refactor/harden it or remove it and have the frontend communicate directly with `todo-backend`.

## 2. Key Components & Their Status

Refer to `CODEBASE_EXPLANATION.md` for more details on the initial structure.

*   **`fullstackjp` (Frontend)**:
    *   **Technology**: React (bootstrapped with Create React App).
    *   **Key Files**: `src/App.js`, `src/index.js`, `public/index.html`.
    *   **`package.json`**: Located at `fullstackjp/package.json`.
    *   **Dependencies**: Managed by `react-scripts@5.0.1`. As per `OUTDATED_DEPENDENCIES_REPORT.md`, this version is current, and its direct dependencies are likely aligned. However, monitor `npm audit` for transitive dependency vulnerabilities.
    *   **Dockerfile**: `fullstackjp/Dockerfile` (requires significant security improvements).

*   **`API_server` (Proxy)**:
    *   **Technology**: Express.js.
    *   **Key File**: `API_server/index.js`.
    *   **Dependencies**: Implied: `express`, `axios`. No dedicated `package.json` is visible; it might use the root-level `package.json` or have its dependencies installed globally/manually within its directory. Versioning for `axios` is particularly important to avoid SSRF if it's an old version (see `OUTDATED_DEPENDENCIES_REPORT.md`).
    *   **Log Files**: `API_server/output.log`, `API_server/output.txt`. These currently contain benign information but could store sensitive data if logging is expanded carelessly.

*   **`todo-backend` (Backend API)**:
    *   **Technology**: Express.js.
    *   **Templating Engine**: `jade` (version `^1.9.2`). **This is critically outdated and a major security risk.**
    *   **Key Files**: `app.js` (Express app setup), `routes/index.js` (defines API routes).
    *   **`package.json`**: Located at `todo-backend/package.json`. Contains several outdated dependencies (see `OUTDATED_DEPENDENCIES_REPORT.md`).
    *   **Dockerfile**: `todo-backend/Dockerfile` (requires significant security improvements).
    *   **Critical Issue**: The todo list is currently hardcoded in `routes/index.js`. There is no database or persistence mechanism, and no user separation for data.

## 3. Development Environment & Build Process

*   **Starting Services** (based on root `README.md`):
    *   **Frontend (`fullstackjp`)**: `cd fullstackjp && npm start`
    *   **Backend (`todo-backend`)**: `cd todo-backend && npm start`
    *   **`API_server`**: The `README.md` does not specify how to start `API_server`. It's likely `node API_server/index.js`. If the root `package.json` has a script for it, that could also be used.
*   **Docker Usage**:
    *   Dockerfiles are present: `fullstackjp/Dockerfile` and `todo-backend/Dockerfile`.
    *   **Critical Security Improvements Needed**: Refer to `DOCKERFILE_SECURITY_REVIEW.md`. Key issues include:
        *   Using outdated `node:14` base images.
        *   Containers run as the `root` user.
        *   Broad `COPY . .` in `todo-backend/Dockerfile` risks including sensitive files. `fullstackjp/Dockerfile` is incomplete.
        *   Lack of multi-stage builds.

## 4. Major Vulnerabilities Summary (Actionable for Agent)

For comprehensive details, see `VULNERABILITIES.md`.

*   **Outdated Dependencies (`todo-backend`)**:
    *   **`jade: ^1.9.2` is critical.** It's highly susceptible to XSS and potentially other vulnerabilities.
    *   **Action**: Prioritize updating `jade` to `pug`.
    *   **Action**: Run `npm audit` in `todo-backend/` and systematically update other dependencies like `cookie-parser`, `debug`, `http-errors`, `morgan`.
*   **No Authentication/Authorization (`todo-backend`)**:
    *   Currently, there are no user accounts or access controls. All data (if persisted) would be globally accessible.
    *   **Action**: Implement user registration, login, and session/token management. Ensure API endpoints are protected.
*   **No HTTPS**:
    *   All data is transmitted in plaintext between components and the client.
    *   **Action**: Plan for HTTPS configuration in a production/staging environment (e.g., using a reverse proxy like Nginx with Let's Encrypt).
*   **Insecure Docker Containers**:
    *   Both Dockerfiles use outdated Node.js base images and run applications as root. `todo-backend`'s Dockerfile has risky file copying practices.
    *   **Action**: Implement all recommendations from `DOCKERFILE_SECURITY_REVIEW.md`, including updating base images, using a non-root user, implementing multi-stage builds, and using `.dockerignore`.
*   **No Input Validation (Assumed for `todo-backend`)**:
    *   While current routes are basic, future CRUD operations will require input. The current codebase shows no signs of input validation.
    *   **Action**: For any new or modified endpoints in `todo-backend` that handle client data, implement robust input validation and sanitization using libraries like `express-validator` or `joi`.

## 5. Key Improvement Areas (Actionable for Agent)

Consult `IMPROVEMENTS.md` for a detailed list.

*   **`todo-backend` Overhaul**:
    *   **Action**: Implement full CRUD (Create, Read, Update, Delete) operations for todos.
    *   **Action**: Integrate a database (SQLite for simplicity initially, then consider PostgreSQL/MongoDB for scalability).
    *   **Action**: Implement Authentication and Authorization (user accounts, protected routes, data isolation).
    *   **Action**: Update `jade` to `pug` and other dependencies.
    *   **Action**: Remove the unused `/users` route from `routes/index.js` and `app.js`.
*   **`API_server` Strategy**:
    *   **Action**: Evaluate whether to keep `API_server`.
        *   If kept: Refactor for security (strict routing, input validation, update dependencies, minimal processing).
        *   If removed: Update `fullstackjp` to make API calls directly to `todo-backend`. This is the simpler approach for the current application scale.
*   **Security Hardening**:
    *   **Action**: Implement security headers using `helmet` in `todo-backend` (and `API_server` if kept).
    *   **Action**: Standardize error handling to provide generic messages to clients and detailed logs on the server.
    *   **Action**: Implement structured and secure logging (e.g., using `winston` or `pino`), avoiding sensitive data in logs.
*   **Docker Improvements**:
    *   **Action**: Fully implement recommendations from `DOCKERFILE_SECURITY_REVIEW.md` (update base images, non-root user, multi-stage builds, `.dockerignore`, `HEALTHCHECK`).
*   **Testing**:
    *   **Action**: Introduce unit tests (Jest/Mocha) for backend logic and potentially frontend components.
    *   **Action**: Add integration tests for API endpoints.

## 6. Agent's Focus Points / Order of Operations (Suggested)

This provides a structured approach to tackling the required improvements:

*   **Priority 1: Foundational Security & Core Functionality (`todo-backend` focus)**
    1.  **Update `jade` to `pug` in `todo-backend/app.js` and `todo-backend/package.json`.** (Addresses critical XSS risk).
    2.  **Run `npm audit fix` or manually update other vulnerable dependencies in `todo-backend/package.json`.** (Reduces immediate security exposure).
    3.  **Implement basic database persistence for todos in `todo-backend`.** Replace the hardcoded array with SQLite or a simple file-based JSON store initially.
    4.  **Secure Dockerfiles**:
        *   Update `FROM node:14` to a current LTS (e.g., `node:20-slim`) in both Dockerfiles.
        *   Implement non-root user execution in both Dockerfiles.
        *   Create/improve `.dockerignore` files for `todo-backend` and `fullstackjp`.

*   **Priority 2: Essential Features & Frontend Integration**
    1.  **Implement full CRUD operations (Create, Read, Update, Delete) for todos in `todo-backend/routes/index.js`.**
    2.  **Implement User Authentication & Authorization in `todo-backend`**:
        *   User registration and login routes.
        *   Password hashing (e.g., `bcryptjs`).
        *   JWT or session-based authentication.
        *   Middleware to protect todo CRUD routes.
        *   Associate todos with user IDs for data isolation.
    3.  **Update `fullstackjp` frontend**:
        *   Integrate with the new auth system (login/registration forms, token handling).
        *   Update API calls to support full CRUD operations.
        *   Adjust API endpoints if `API_server` is removed/kept.

*   **Priority 3: Best Practices, Robustness & Finalizing Security**
    1.  **Plan and Implement HTTPS for Deployment**: Research and document steps for deploying with HTTPS (e.g., Nginx reverse proxy with Let's Encrypt).
    2.  **Add Comprehensive Input Validation to `todo-backend`**: Use a library like `express-validator` for all data-handling endpoints.
    3.  **Finalize `API_server` Strategy**: If keeping it, refactor and secure it thoroughly. If removing, ensure all frontend calls target `todo-backend` correctly.
    4.  **Write Tests**: Implement unit and integration tests for `todo-backend`. Consider basic UI tests for `fullstackjp`.
    5.  **Further Docker Hardening**:
        *   Implement multi-stage builds for both Dockerfiles.
        *   Investigate and integrate a Docker image security scanner (e.g., Trivy) into a potential CI/CD workflow.
        *   Add `HEALTHCHECK` instructions to Dockerfiles.
    6.  **Apply General Security Best Practices**: Add security headers (`helmet`), refine logging, and ensure robust error handling throughout.

By following this guide, the AI agent can systematically improve the security, functionality, and maintainability of the "Todo" application. Remember to consult the detailed reports (`VULNERABILITIES.MD`, `IMPROVEMENTS.MD`, etc.) for more specific context on each point.I have synthesized the information from all previous reports into `AGENT.md`. This file provides a comprehensive guide for an AI agent developer, covering:

1.  **Project Overview**: Application description, architecture, and a note on `API_server`'s utility.
2.  **Key Components & Their Status**: Details on `fullstackjp`, `API_server`, and `todo-backend`, including technologies, key files, `package.json` locations, dependencies, and critical issues.
3.  **Development Environment & Build Process**: Instructions for starting services and a summary of Docker usage with pointers to essential security improvements.
4.  **Major Vulnerabilities Summary**: Actionable list including outdated dependencies (critical `jade`), lack of AuthN/AuthZ, missing HTTPS, insecure Docker containers, and absence of input validation.
5.  **Key Improvement Areas**: Actionable list covering `todo-backend` overhaul (CRUD, database, Auth, dependency updates), `API_server` decision, security hardening, Docker improvements, and testing.
6.  **Agent's Focus Points / Order of Operations**: A prioritized plan (Priority 1: Security & Core; Priority 2: Essential Features; Priority 3: Best Practices) to guide development.

This structured approach should enable the AI agent to effectively address the application's shortcomings.
