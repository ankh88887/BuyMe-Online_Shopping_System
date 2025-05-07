import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  // Retrieve and parse currentUser from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Check if currentUser exists and is valid
  if (!currentUser || !currentUser.username || !currentUser.email) {
    // Redirect to login if the user is not logged in or invalid
    return <Navigate to="/login" />;
  }

  // Allow access if the user is logged in
  return children;
}