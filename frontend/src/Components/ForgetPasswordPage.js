import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style.css';

export default function ForgetPasswordPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the new passwords match
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/api/users/forget-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        // If the backend confirms the username and email match, and the password is updated
        alert('Password changed successfully!');
        navigate('/login'); // Redirect to the login page
      } else {
        // If the username and email do not match or any other error occurs
        alert(data.message); // Show the error message from the backend
      }
    } catch (err) {
      console.error(err);
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
          </div>
          <div className="form-img">
            <img src="/Images/BuyMe_Logo_Transparent.png" alt="BuyMe Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}