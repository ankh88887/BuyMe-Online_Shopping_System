import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './UserProfilePage.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    address: '123 Main St, City, Country',
    cardName: 'John Doe',
    cardNumber: '3872 2378 2331 4242',
    expiryMonth: '04',
    expiryYear: '25',
    cvv: '888'
  });

  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState({...userData});
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
          setTempData(data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({...tempData, [name]: value});
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(tempData)
      });
      const data = await response.json();
      if (data.success) {
        setUserData(tempData);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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

        <div className="profile-section">
          <h3>Edit User Information</h3>
          
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
              <div className="info-display">{userData.address}</div>
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
              <div className="info-display">{userData.cardName}</div>
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
                  {formatCardNumber(userData.cardNumber)}
                </div>
              )}
              <button 
                type="button" 
                className="eye-icon"
                onClick={toggleCardNumberVisibility}
              >
                {showCardNumber ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-row">
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
                  {userData.expiryMonth}/{userData.expiryYear}
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
                    {formatCVV(userData.cvv)}
                  </div>
                )}
                <button 
                  type="button" 
                  className="eye-icon"
                  onClick={toggleCVVVisibility}
                >
                  {showCVV ? <FaEyeSlash /> : <FaEye />}
                </button>
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