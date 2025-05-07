import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CurrentLoginUser } from './CurrentLoginUser'; // Import the context

export default function ProtectedRoute({ children }) {
  // Retrieve the current user from the context
  const { currentUser } = useContext(CurrentLoginUser);

  // Check if currentUser exists
  if (!currentUser) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/login" />;
  }

  // Allow access if the user is logged inif the user is logged in
  return children; return children;

}