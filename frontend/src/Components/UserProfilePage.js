import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './UserProfilePage.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    address: '',
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({...userData});
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');

  useEffect(() => {
    // Reset visibility states when not in edit mode
    if (!editMode) {
      setShowCardNumber(false);
      setShowCVV(false);
    }
  }, [editMode]);

  useEffect(() => {
    // Fetch user data from API
    // const fetchUserData = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await fetch(`${process.env.REACT_APP_API_URL}/userinfo/profile`, {
    //       headers: {
    //         'Authorization': 'Bearer ' + localStorage.getItem('token')
    //       }
    //     });
        
    //     const data = await response.json();
        
    //     if (data.success) {
    //       setUserData(data.user);
    //       setTempData(data.user);
    //       setError(null);
    //     } else {
    //       setError(data.message || 'Failed to load profile');
    //       if (response.status === 401) {
    //         // Unauthorized - redirect to login
    //         localStorage.removeItem('token');
    //         navigate('/login');
    //       }
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //     setError('Network error. Please try again later.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

  const fetchUserData = async () => {
    setLoading(true); // Set loading to true at the start
    try {
      // Get the userID from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      const userID = user?.userID || "1"; // Default to 1 if not found
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userinfo/profile/${userID}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
        setTempData(data.user);
        setError(null);
      } else {
        setError(data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when done, whether successful or not
    }
  };
  
    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({...tempData, [name]: value});
  };

  const handleSaveChanges = async () => {
    try {
      setUpdateStatus('');
      setUpdateMessage('');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userinfo/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(tempData)
      });

      // Log the full response for debugging
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.success) {
        setUserData(tempData);
        setEditMode(false);
        setUpdateStatus('success');
        setUpdateMessage('Profile updated successfully!');
      } else {
        setUpdateStatus('error');
        setUpdateMessage(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateStatus('error');
      setUpdateMessage('Network error. Please try again later.');
    }
  };

  const handleCancel = () => {
    setTempData({...userData});
    setEditMode(false);
  };

  const toggleCardNumberVisibility = () => {
    setShowCardNumber(!showCardNumber);
  };

  const toggleCVVVisibility = () => {
    setShowCVV(!showCVV);
  };

  const formatCardNumber = (number) => {
    if (!number) return '';
    if (showCardNumber) {
      return number.replace(/(\d{4})/g, '$1 ').trim();
    }
    return '•••• •••• •••• ' + number.slice(-4);
  };

  const formatCVV = (cvv) => {
    if (!cvv) return '';
    return showCVV ? cvv : '•••';
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-background">
      <div className="user-profile-container">
        <div className="profile-header">
          <img 
            src="/path-to-user-icon.png"
            alt="User Icon" 
            className="user-icon"
          />
          <h1>{userData.username}</h1>
        </div>
        
        {updateMessage && (
          <div className={`update-message ${updateStatus}`}>
            {updateMessage}
          </div>
        )}
        
        <div className="profile-section">
          <h3>User Information</h3>
          
          <div className="form-group">
            <label>Username</label>
            {editMode ? (
              <input
                type="text"
                name="username"
                value={tempData.username}
                onChange={handleInputChange}
              />
            ) : (
              <div className="info-display">{userData.username}</div>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            {editMode ? (
              <input
                type="email"
                name="email"
                value={tempData.email}
                onChange={handleInputChange}
              />
            ) : (
              <div className="info-display">{userData.email}</div>
            )}
          </div>

          <div className="form-group">
            <label>Address</label>
            {editMode ? (
              <input
                type="text"
                name="address"
                value={tempData.address}
                onChange={handleInputChange}
              />
            ) : (
              <div className="info-display">{userData.address || 'Not provided'}</div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h3>Payment Method</h3>
          
          <div className="form-group">
            <label>Card holder's name</label>
            {editMode ? (
              <input
                type="text"
                name="cardName"
                value={tempData.cardName}
                onChange={handleInputChange}
              />
            ) : (
              <div className="info-display">{userData.cardName || 'Not provided'}</div>
            )}
          </div>

          <div className="form-group">
            <label>Card No.</label>
            <div className="input-with-icon">
              {editMode ? (
                <input
                  type={showCardNumber ? "text" : "password"}
                  name="cardNumber"
                  value={tempData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                />
              ) : (
                <div className="info-display">
                  {userData.cardNumber ? formatCardNumber(userData.cardNumber) : 'Not provided'}
                </div>
              )}
              {(editMode || userData.cardNumber) && (
                <button 
                  type="button" 
                  className="eye-icon"
                  onClick={toggleCardNumberVisibility}
                >
                  {showCardNumber ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
          </div>

          <div className="form-row-1">
            <div className="form-group">
              <label>Expiry date</label>
              {editMode ? (
                <div className="expiry-inputs">
                  <input
                    type="text"
                    name="expiryMonth"
                    value={tempData.expiryMonth}
                    onChange={handleInputChange}
                    placeholder="MM"
                    maxLength="2"
                  />
                  <span>/</span>
                  <input
                    type="text"
                    name="expiryYear"
                    value={tempData.expiryYear}
                    onChange={handleInputChange}
                    placeholder="YY"
                    maxLength="2"
                  />
                </div>
              ) : (
                <div className="info-display">
                  {userData.expiryMonth && userData.expiryYear ? 
                    `${userData.expiryMonth}/${userData.expiryYear}` : 
                    'Not provided'}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>CVV</label>
              <div className="input-with-icon">
                {editMode ? (
                  <input
                    type={showCVV ? "text" : "password"}
                    name="cvv"
                    value={tempData.cvv}
                    onChange={handleInputChange}
                    maxLength="3"
                  />
                ) : (
                  <div className="info-display">
                    {userData.cvv ? formatCVV(userData.cvv) : 'Not provided'}
                  </div>
                )}
                {(editMode || userData.cvv) && (
                  <button 
                    type="button" 
                    className="eye-icon"
                    onClick={toggleCVVVisibility}
                  >
                    {showCVV ? <FaEyeSlash /> : <FaEye />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
          
          <button 
            className="btn-password" 
            onClick={() => navigate('/reset-password')}
          >
            Set a new password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;