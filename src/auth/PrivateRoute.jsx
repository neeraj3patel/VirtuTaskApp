// Private Route Component
// Protects routes that require authentication
// Redirects unauthenticated users to the login page

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to login page
  // Preserve the attempted URL in state so we can redirect back after login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}

export default PrivateRoute;
