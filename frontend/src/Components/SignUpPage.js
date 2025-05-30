import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import './style.css';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; 
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5005/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        }),
      });

      if (response.ok) {
        const user = await response.json();
        console.log('User created:', user); 
        alert('Account created successfully!');
        navigate('/login'); 
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to create account');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
    }
  };

  return (    
    <div className="login-container">
      <div className="login-box">
        <div>
          <img src="/Images/BuyMe_Logo_Transparent.png" alt="BuyMe Logo" className="form-img" />
        </div>
        <div style={{width:"550px"}}>
          <h2 style={{margin:"40px 0px", textAlign:"center"}}><strong>Create BuyMe Account</strong></h2>
          <form onSubmit={handleSubmit} >
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            <input
              type="password"
              placeholder="Enter Password Again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
            />
            <button className="form-button" type="submit">
              Sign up
            </button>
          </form>
          <p style={{margin:"10px 0px"}}>
            Existing User? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
