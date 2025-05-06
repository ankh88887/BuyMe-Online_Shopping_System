import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, isAdmin }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/login" />;
  }

  if (isAdmin && !currentUser.isAdmin) {
    // Redirect to home if the user is not an admin
    return <Navigate to="/" />;
  }

  return children;
}