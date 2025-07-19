# Brillian Flashcards Project Guide

## 1. Project Overview

Brillian Flashcards is a full-stack web application designed for creating, playing, and managing flashcards and quizzes. It features AI-powered generation and grading of flashcards via a backend API.

### Key Technologies
- Frontend: React 19, Vite, TailwindCSS, Material-UI, Emotion, React Router
- Backend: Node.js, Express.js, dotenv
- APIs for flashcard generation and grading
- Chart libraries for displaying learning statistics

### Architecture
- Frontend SPA built with React and Vite
- Backend REST API server with Express.js
- Proxy configuration in Vite to forward API requests to backend during development

---

## 2. Getting Started

### Prerequisites
- Node.js (recommended v18+)
- npm or yarn package manager

### Installation
1. Clone the repository
2. Install frontend dependencies:
   ```sh
   cd brillian-flashcarsd
   npm install
   ```
3. Install backend dependencies:
   ```sh
   cd server/Brillian-Flashcard-Backend
   npm install
   ```

### Running the Application
- Start backend server:
  ```sh
  npm run start
  # or
  node server.js
  ```
- Start frontend development server:
  ```sh
  cd brillian-flashcarsd
  npm run dev
  ```
- Access the frontend at `http://localhost:5173`

### Running Tests
- (No test framework detected; add tests as needed)

---

## 3. Project Structure

```
brillian-flashcarsd/
  ├─ src/                  # React frontend source code
  ├─ public/               # Static assets and public files
  ├─ server/               # Backend Express server code
  │   └─ Brillian-Flashcard-Backend/
  ├─ package.json          # Frontend package config
  ├─ vite.config.js        # Vite configuration (proxy, plugins)
  ├─ README.md             # Basic project description
```

### Important Files
- `src/` - React components, pages, styles, and utility libs
- `server/Brillian-Flashcard-Backend/server.js` - Backend Express entry point
- Backend route files in `server/Brillian-Flashcard-Backend/routes/` handle API endpoints
- `vite.config.js` - Configures React, TailwindCSS, and API proxy
- `package.json` - Dependency and script definitions for frontend

---

## 4. Development Workflow

### Coding Standards
- React functional components with hooks
- Use ESLint with React plugin for linting
- Styles implemented with TailwindCSS and Emotion where necessary

### Testing
- No formal tests present currently; recommend adding Jest/React Testing Library

### Build and Deployment
- Frontend build with `npm run build` (vite build)
- Backend deploy as Node.js server

### Contribution
- Follow React and JavaScript best practices
- Respect existing directory architecture

---

## 5. Key Concepts

### Domain Terms
- Flashcard: An individual question-answer item
- Deck: Collection of flashcards
- Quiz: Interactive test derived from flashcards

### Core Components
- React components in `src/` manage UI for flashcards, decks, quizzes, community pages, stats
- Backend APIs generate and grade flashcards dynamically using AI

### Design Patterns
- React Context API for shared state (`src/lib/DeckContext.jsx`)
- Proxy pattern in Vite config to access backend API seamlessly in development

---

## 6. Common Tasks

### Add a New Feature
1. Add React component under `src/`
2. Add styling with Tailwind/emotion
3. Add any backend API route in `server/Brillian-Flashcard-Backend/routes/` if needed
4. Test feature locally

### Run Frontend Dev Server
```sh
npm run dev
```

### Run Backend Server
```sh
cd server/Brillian-Flashcard-Backend
node server.js
```

---

## 7. Troubleshooting

- Backend API not reachable? Check proxy setting in `vite.config.js` and backend server running at correct port
- ESLint errors? Run `npm run lint` for detailed messages
- Styling issues? Verify TailwindCSS installed and configured correctly

---

## 8. References

- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Material-UI](https://mui.com/)

---

*Note: Some information was inferred from the codebase structure and typical patterns. Please verify and adjust for accuracy as needed.*
