import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import './style.css';
import { CurrentLoginUser } from '../Components/CurrentLoginUser';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(CurrentLoginUser);

  useEffect(() => {
    localStorage.removeItem('currentUser');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="login-box">
      <h1></h1>
      <div className="container">
        <div className="main">
          <div className="content">
            <h2>You are logged out. See you next time!</h2>
            <h2>Want to go shopping? Press the button below to Login again!</h2>
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