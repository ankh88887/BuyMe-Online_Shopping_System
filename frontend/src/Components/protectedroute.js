import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/login" />;
  }

  // Allow access if the user is logged in
  return children;
}