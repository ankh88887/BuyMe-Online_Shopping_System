import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { Link } from 'react-router-dom';

export default function ForgetPasswordPage() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the new passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Check password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, with letters and numbers
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    try {
      // Send request to verify user and update password
      const response = await fetch('http://localhost:5005/api/users/forget-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, email, password, confirmPassword }),
      });

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          alert(data.message || 'Password updated successfully!');
        } else {
          alert('Password updated successfully!');
        }
        navigate('/login'); // Redirect to the login page
      } else {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to update password');
        } else {
          alert('Failed to update password');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-box">
      <h1></h1>
      <div className="container">
        <div className="main">
          <div className="content">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Current username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                autoFocus
              />
              <input
                type="email"
                placeholder="Current email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter Password Again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button className="button" type="submit">
                Change Password
              </button>
            </form>
            <p className="account">
              Login?<Link to="/login"> Click here </Link>
            </p>
          </div>
          <div className="form-img">
            <img src="/Images/BuyMe_Logo_Transparent.png" alt="BuyMe Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}