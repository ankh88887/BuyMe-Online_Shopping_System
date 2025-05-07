import { Link, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import './style.css';
import { CurrentLoginUser } from "./CurrentLoginUser";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(CurrentLoginUser); // Use setCurrentUser from context

  useEffect(() => {
    // Clear the current user from localStorage
    localStorage.removeItem('currentUser');
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');

    // Reset currentUser to null
    setCurrentUser(null);

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="login-box">
      <h1></h1>
      <div className="container">
        <div className="main">
          <div className="content">
            <h2>You are logged out. See you next time!</h2>
            <button className="button" type="button" onClick={handleLogout}>
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