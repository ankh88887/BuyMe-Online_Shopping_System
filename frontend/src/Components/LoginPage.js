import { Link, useNavigate } from "react-router-dom";
import './style.css';
import { useContext, useState } from "react";
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
    <div className="login-container">
      <div className="login-box">
        <div>
          <img src="/Images/BuyMe_Logo_Transparent.png" alt="BuyMe Logo" className="form-img" />
        </div>
        <div className="content">
          <h2 style={{margin:"40px 20px"}}><strong>Log in to BuyMe</strong></h2>
          <form onSubmit={handleSubmit} >
            <input
              type="text"
              placeholder="Username/Email"
              value={userNameOrEmail}
              onChange={(e) => setUserNameOrEmail(e.target.value)}
              required
              autoFocus
              className="form-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button className="form-button" type="submit">
              Login
            </button>
          </form>
          <p className="account">
            Forget Password? <Link to="/forgetpw">Click here</Link>
          </p>
          <p className="account">
            New User? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

