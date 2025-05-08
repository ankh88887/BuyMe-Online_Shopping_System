import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { CurrentLoginUser } from "./CurrentLoginUser";
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

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
      <div className="container mt-5">
        <div className="alert alert-warning">
          Please log in to change your password.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex align-items-center">
              <FaLock className="me-2" />
              <h3 className="mb-0">Reset Password</h3>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="form-label">Current Password</label>
                  <div className="input-group">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      className="form-control"
                      id="oldPassword"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <div className="input-group">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className="form-control"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter your new password"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <small className="form-text text-muted">
                    Password must be at least 8 characters long and contain both letters and numbers.
                  </small>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your new password"
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={loading}
                  >
                    {loading ? "Changing Password..." : "Change Password"}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
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