import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { CurrentLoginUser } from "./CurrentLoginUser";
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const { currentUser } = useContext(CurrentLoginUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password validation patterns
  const atLeastEightChars = /.{8,}/;
  const hasLetters = /[a-zA-Z]/;
  const hasNumbers = /[0-9]/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePassword = (password) => {
    const isLongEnough = atLeastEightChars.test(password);
    const hasLettersValid = hasLetters.test(password);
    const hasNumbersValid = hasNumbers.test(password);
    
    return isLongEnough && hasLettersValid && hasNumbersValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const { oldPassword, newPassword, confirmPassword } = formData;
    
    // Check if all fields are filled
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    
    // Validate new password format
    if (!validatePassword(newPassword)) {
      setError("New password must be at least 8 characters long and contain both letters and numbers");
      return;
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userinfo/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: currentUser.userID,
          currentPassword: oldPassword,
          newPassword: newPassword
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Password changed successfully!");
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        
        // Redirect to profile page after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else {
        setError(data.message || "Failed to change password");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Error changing password:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="reset-password-unique-container mt-5">
        <div className="reset-password-unique-alert-warning">
          Please log in to change your password.
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-unique-container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="reset-password-unique-card">
            <div className="reset-password-unique-header d-flex align-items-center">
              <FaLock className="reset-password-unique-icon me-2" />
              <h3 className="reset-password-unique-title mb-0">Reset Password</h3>
            </div>
            <div className="reset-password-unique-body">
              {error && <div className="reset-password-unique-alert-danger">{error}</div>}
              {success && <div className="reset-password-unique-alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="reset-password-unique-form-label">Current Password</label>
                  <div className="input-group">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      className="reset-password-unique-form-control-password"
                      id="oldPassword"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                    />
                    <button 
                      type="button" 
                      className="reset-password-unique-btn btn-outline-secondary"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="newPassword" className="reset-password-unique-form-label">New Password</label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="reset-password-unique-form-control-password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter your new password"
                    />
                    <button 
                      type="button" 
                      className="reset-password-unique-btn btn-outline-secondary"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <small className="reset-password-unique-form-text text-muted">
                    Password must be at least 8 characters long and contain both letters and numbers.
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="reset-password-unique-form-label">Confirm New Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="reset-password-unique-form-control-password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                    />
                    <button 
                      type="button" 
                      className="reset-password-unique-btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="reset-password-unique-btn-primary" 
                    disabled={loading}
                  >
                    {loading ? "Changing Password..." : "Change Password"}
                  </button>
                  <button 
                    type="button" 
                    className="reset-password-unique-btn-secondary"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;