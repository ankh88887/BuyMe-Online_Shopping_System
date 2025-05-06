import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './style.css';

export default function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the current user from localStorage
    localStorage.removeItem('currentUser');
  }, []);

  return (
    <div className="login-box">
      <h1></h1>
      <div className="container">
        <div className="main">
          <div className="content">
            <h2>You are logged out. See you next time!</h2>
            <button className="button" type="button">
              <Link to="/login">Login Page</Link>
            </button>
          </div>
          <div className="form-img">
            <img src="/Images/BuyMe_Logo_Transparent.png" alt="BuyMe Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}