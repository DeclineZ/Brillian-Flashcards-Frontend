# Project Guide: Brillian Flashcards
## 1. Project Overview

Brillian Flashcards is a modern educational flashcard application designed to enhance learning through interactive quizzes and spaced repetition techniques.

- **Frontend:** Built with React and Vite, utilizing TailwindCSS for styling and several UI libraries like MUI and Emotion.
- **Backend:** Node.js with Express serving API endpoints and managing data operations.
- **Architecture:** Decoupled frontend and backend services communicating over REST APIs. Native mobile support via Capacitor integration.
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
- Node.js and npm/yarn
- Android Studio / Xcode for mobile development (Capacitor)
- Git version control
### Installation
1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd <root>
   npm install
