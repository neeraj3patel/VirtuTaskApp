// Main App Component
// Sets up routing and authentication provider for the entire application
// Routes are protected using PrivateRoute for authenticated-only access

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";

function App() {
  return (
    // AuthProvider wraps entire app to provide auth state everywhere
    <AuthProvider>
      <Router>
        <Routes>
          {/* Protected route - only accessible when logged in */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Todos />
              </PrivateRoute>
            }
          />

          {/* Public routes for authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
