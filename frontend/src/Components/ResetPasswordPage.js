import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './UserProfilePage.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'old':
        setShowOldPassword(!showOldPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords({...passwords, [name]: value});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!passwords.oldPassword) newErrors.oldPassword = 'Old password is required';
    if (!passwords.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwords.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          oldPassword: passwords.oldPassword,
          newPassword: passwords.newPassword
        })
      });
      const data = await response.json();
      
      if (data.success) {
        navigate('/profile');
      } else {
        setErrors({ oldPassword: data.message || 'Password update failed' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  const handleClear = () => {
    setPasswords({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="reset-background">
      <div className="reset-password-container">
        <h2><b><u>Reset Password</u></b></h2>
        
        <div className="form-group">
          <label>Old Password</label>
          <div className="input-with-icon">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldPassword"
              value={passwords.oldPassword}
              onChange={handleInputChange}
            />
            <button 
              type="button" 
              className="eye-icon"
              onClick={() => togglePasswordVisibility('old')}
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.oldPassword && <span className="error">{errors.oldPassword}</span>}
        </div>
        
        <div className="form-group">
          <label>New Password</label>
          <div className="input-with-icon">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleInputChange}
            />
            <button 
              type="button" 
              className="eye-icon"
              onClick={() => togglePasswordVisibility('new')}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.newPassword && <span className="error">{errors.newPassword}</span>}
        </div>
        
        <div className="form-group">
          <label>Confirm New Password</label>
          <div className="input-with-icon">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleInputChange}
            />
            <button 
              type="button" 
              className="eye-icon"
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>
        
        <div className="password-actions">
          <button className="btn-update" onClick={handleUpdate}>
            Update
          </button>
          <button className="btn-clear" onClick={handleClear}>
            Clear
          </button>
          <button className="btn-back" onClick={() => navigate('/profile')}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;