import { Link, useNavigate } from "react-router-dom";
import './style.css';
import React, { useContext, useState } from "react";
import { CurrentLoginUser } from "./CurrentLoginUser";

export default function Login() {
  const [userNameOrEmail, setUserNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(CurrentLoginUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5005/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userNameOrEmail, password }),
      });

      if (response.ok) {
        const user = await response.json();

        setCurrentUser(user);
        console.log('Current User:', user); 
        console.log('Current User in user variable:', currentUser); 
        console.log('User ID:', user.userID); 
        navigate('/');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Invalid username/email or password!');
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
            <h2>Log in to BuyMe</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username/Email"
                value={userNameOrEmail}
                onChange={(e) => setUserNameOrEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="button" type="submit">
                Login
              </button>
            </form>
            {currentUser && (
              <p>Logged in as: {currentUser.userName || currentUser.email} (User ID: {currentUser.userID})</p>
            )}
            <p className="account">
              Forget Password? <Link to="/forgetpw">Click here</Link>
            </p>
            <p className="account">
              New User? <Link to="/signup">Sign up</Link>
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

