import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './style.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5005/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token or user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify(data));
        alert('Login successful!');
        navigate('/'); // Redirect to the home page
      } else {
        alert(data.message); // Show error message
      }
    } catch (err) {
      console.error(err);
      alert('Password or email is incorrect!');
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

