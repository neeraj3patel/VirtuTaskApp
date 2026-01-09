# TaskFlow - Todo App

A modern, full-stack Todo application built with React, Vite, and Firebase.

![React](https://img.shields.io/badge/React-19.1.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)
![Firebase](https://img.shields.io/badge/Firebase-11.8.1-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.6-cyan)

## Features

### Authentication
- 🔐 Email/Password authentication
- 🔑 Google OAuth login
- 🔄 Persistent login sessions
- 🛡️ Protected routes

### Todo Management
- ✅ Create, Read, Update, Delete todos
- 📊 Real-time sync with Firestore
- 👤 User-specific todos (each user sees only their todos)
- 📈 Task statistics (Pending/Completed counts)

### UI/UX
- 🌙 Modern dark theme with glassmorphism design
- 🎨 Gradient backgrounds and buttons
- 📱 Fully responsive design
- ⚡ Smooth transitions and hover effects

## Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** Tailwind CSS 4
- **Backend:** Firebase (Auth + Firestore)
- **Routing:** React Router DOM

## Project Structure

```
src/
├── auth/
│   ├── AuthContext.jsx    # Auth state management
│   └── PrivateRoute.jsx   # Route protection
├── firebase/
│   └── firebaseConfig.js  # Firebase configuration
├── pages/
│   ├── Login.jsx          # Login page
│   ├── Register.jsx       # Registration page
│   └── Todos.jsx          # Main todo page
├── components/
│   ├── TodoForm.jsx
│   ├── TodoItem.jsx
│   └── TodoList.jsx
├── App.jsx                # Main app with routing
└── main.jsx               # Entry point
```

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Auth & Firestore enabled

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd ToDo-main
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase

Update `src/firebase/firebaseConfig.js` with your Firebase credentials:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

4. Enable Firebase services
- Go to Firebase Console
- Enable **Email/Password** authentication
- Enable **Google** sign-in provider
- Create **Firestore** database

5. Run the app
```bash
npm run dev
```

## Firebase Firestore Structure

```
users/
└── {userId}/
    └── todos/
        └── {todoId}/
            ├── text: string
            ├── completed: boolean
            └── createdAt: timestamp
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Screenshots

### Login Page
- Dark theme with gradient background
- Email/Password form
- Google OAuth button
- Link to register

### Register Page
- Email, Password, Confirm Password fields
- Google OAuth option
- Link to login

### Todos Page
- Header with user email and logout
- Stats cards (Pending/Completed)
- Add todo form
- Todo list with toggle and delete

## License

MIT
