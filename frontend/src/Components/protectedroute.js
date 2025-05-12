import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { CurrentLoginUser } from './CurrentLoginUser';

export default function ProtectedRoute({ children }) {
  // Retrieve the current user from the context
  const { currentUser } = useContext(CurrentLoginUser);

  // Check if currentUser exists
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  return children;
}