import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { CurrentLoginUser } from "./CurrentLoginUser";
import { useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import userIcon from '../Images/user_icon.png';
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const { currentUser } = useContext(CurrentLoginUser);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: ""
  });
  const [showCVV, setShowCVV] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const successTimeoutRef = useRef(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userinfo/profile/${currentUser.userID}`);
      const data = await response.json();
      
      if (data.success) {
        const userData = data.user;
        setUserProfile(userData);
        setEditedProfile(userData);
        
        // Set payment info
        setPaymentInfo({
          cardName: userData.cardName || "",
          cardNumber: userData.cardNumber || "",
          expiryMonth: userData.expiryMonth || "",
          expiryYear: userData.expiryYear || "",
          cvv: userData.cvv || ""
        });
      } else {
        setError("Failed to load user profile: " + data.message);
      }
    } catch (err) {
      setError("Failed to load user profile. Please try again later.");
      console.error("Error fetching user profile:", err);
    }
  }, [currentUser]);

  const formErrorsRef = useRef(formErrors);
  
  useEffect(() => {
    formErrorsRef.current = formErrors;
  }, [formErrors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const { cardName, cardNumber, expiryMonth, expiryYear, cvv } = paymentInfo;
    
    // Check if any payment field is filled
    const anyPaymentFieldFilled = cardName || cardNumber || expiryMonth || expiryYear || cvv;
    
    // If any payment field is filled, validate all payment fields
    if (anyPaymentFieldFilled) {
      // Validate card holder name
      if (!cardName) {
        newErrors.cardName = "Card holder name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(cardName)) {
        newErrors.cardName = "Card holder name can only contain letters";
      }

      // Validate card number
      if (!cardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (cardNumber.replace(/\s/g, '').length < 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      // Validate expiry month
      if (!expiryMonth) {
        newErrors.expiryMonth = "Expiry month is required";
      } else if (parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
        newErrors.expiryMonth = "Month must be between 01 and 12";
      }
      
      // Validate expiry year
      if (!expiryYear) {
        newErrors.expiryYear = "Expiry year is required";
      }
      
      // Validate CVV
      if (!cvv) {
        newErrors.cvv = "CVV is required";
      } else if (cvv.length < 3 || cvv.length > 4) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
 
      // Validate expiry date is in the future
      if (expiryMonth && expiryYear) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
        const currentMonth = currentDate.getMonth() + 1; // getMonth() is 0-indexed
        const month = parseInt(expiryMonth);
        const year = parseInt(expiryYear);
        
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          newErrors.expiryDate = "Expiry date must be in the future";
        }
      }
    }
    
    setFormErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  }, [paymentInfo]); // No formErrors dependency

  useEffect(() => {
    // Fetch user profile data when component mounts
    if (currentUser) {
      fetchUserProfile();
    } else {
      // Redirect to login if no user is logged in
      navigate('/login');
    }
    
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, [currentUser, navigate, fetchUserProfile]);

  useEffect(() => {
    if (success) {
      successTimeoutRef.current = setTimeout(() => {
        setSuccess("");
      }, 3000);
    }
    
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, [success]);

  useEffect(() => {
    validateForm();
  }, [paymentInfo, validateForm]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedProfile({ ...userProfile });
      setPaymentInfo({
        cardName: userProfile.cardName || "",
        cardNumber: userProfile.cardNumber || "",
        expiryMonth: userProfile.expiryMonth || "",
        expiryYear: userProfile.expiryYear || "",
        cvv: userProfile.cvv || ""
      });
      setFormErrors({});
    }
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value,
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // Validation for different fields
    let newValue = value;
    let newErrors = { ...formErrors };
    
    if (name === "cardName") {
      // Only allow letters and spaces for card holder name
      newValue = value.replace(/[^a-zA-Z\s]/g, '');
      if (value !== newValue) {
        newErrors.cardName = "Card holder name can only contain letters";
      } else {
        delete newErrors.cardName;
      }
    } 
    else if (name === "cardNumber") {
      // Remove all non-digits and spaces first
      const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
      
      // Format with spaces after every 4 digits
      newValue = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
      
      // Validate card number length (excluding spaces)
      if (digitsOnly && digitsOnly.length < 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      } else {
        delete newErrors.cardNumber;
      }
    }
    else if (name === "expiryMonth") {
      // Only allow numbers and limit to 2 digits
      newValue = value.replace(/\D/g, '').slice(0, 2);
      
      // Check if month is valid (1-12)
      if (newValue && (parseInt(newValue) < 1 || parseInt(newValue) > 12)) {
        newErrors.expiryMonth = "Month must be between 01 and 12";
      } else {
        delete newErrors.expiryMonth;
      }
    } 
    else if (name === "expiryYear") {
      // Only allow numbers and limit to 2 digits
      newValue = value.replace(/\D/g, '').slice(0, 2);
      delete newErrors.expiryYear;
    }
    else if (name === "cvv") {
      // Only allow numbers and limit to 4 digits, but preserve leading zeros
      newValue = value.replace(/[^0-9]/g, '').slice(0, 4);
      if (newValue && newValue.length < 3) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      } else {
        delete newErrors.cvv;
      }
    }

    setPaymentInfo(prev => ({
      ...prev,
      [name]: newValue,
    }));
    
    setFormErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate the form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      // Combine profile and payment data for submission
      const profileData = {
        userID: currentUser.userID,
        username: editedProfile.username,
        email: editedProfile.email,
        address: editedProfile.address,
        ...paymentInfo,
        cardNumber: paymentInfo.cardNumber.replace(/\s/g, '') // Remove spaces before submission
      };
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userinfo/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchUserProfile();
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
      } else {
        setError("Failed to update profile: " + data.message);
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", err);
    }
  };

  if (!userProfile) {
    return (
      <div className="user-profile-unique-container">
        <p>Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="user-profile-unique-container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="user-profile-unique-card">
            <div className="user-profile-unique-header">
              <div className="d-flex align-items-center">
                <img 
                  src={userIcon} 
                  alt="User Icon" 
                  className="user-profile-unique-icon"
                />
                <h3 className="user-profile-unique-title">User Profile</h3>
              </div>
              {!isEditing ? (
                <button className="user-profile-unique-btn-primary" onClick={handleEditToggle}>
                  <FaEdit className="me-2" /> Edit Profile
                </button>
              ) : (
                <button className="user-profile-unique-btn-secondary" onClick={handleEditToggle}>
                  <FaTimes className="me-2" /> Cancel
                </button>
              )}
            </div>
            <div className="user-profile-unique-body">
              {error && <div className="user-profile-unique-alert-danger">{error}</div>}
              {success && <div className="user-profile-unique-alert-success">{success}</div>}

              {!isEditing ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-4 user-profile-unique-label">Username:</div>
                    <div className="col-md-8 user-profile-unique-value">{userProfile.username}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 user-profile-unique-label">Email:</div>
                    <div className="col-md-8 user-profile-unique-value">{userProfile.email}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 user-profile-unique-label">Address:</div>
                    <div className="col-md-8 user-profile-unique-value">{userProfile.address || "No address provided"}</div>
                  </div>
                  
                  <h4 className="mt-4">Payment Information</h4>
                  <hr className="user-profile-unique-divider" />
                  {userProfile.cardNumber ? (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-4 user-profile-unique-label">Card Holder:</div>
                        <div className="col-md-8 user-profile-unique-value">{userProfile.cardName}</div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-4 user-profile-unique-label">Card Number:</div>
                        <div className="col-md-8 user-profile-unique-value">•••• •••• •••• {userProfile.cardNumber.slice(-4)}</div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-4 user-profile-unique-label">Expiry Date:</div>
                        <div className="col-md-8 user-profile-unique-value">{userProfile.expiryMonth}/{userProfile.expiryYear}</div>
                      </div>
                    </>
                  ) : (
                    <p>No payment information saved.</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h4>Personal Information</h4>
                  <div className="mb-3">
                    <label htmlFor="username" className="user-profile-unique-form-label">Username</label>
                    <input
                      type="text"
                      className="user-profile-unique-form-control"
                      id="username"
                      name="username"
                      value={editedProfile.username || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="user-profile-unique-form-label">Email</label>
                    <input
                      type="email"
                      className="user-profile-unique-form-control"
                      id="email"
                      name="email"
                      value={editedProfile.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="user-profile-unique-form-label">Address</label>
                    <input
                      type="text"
                      className="user-profile-unique-form-control"
                      id="address"
                      name="address"
                      value={editedProfile.address || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Link to="/reset-password" className="user-profile-unique-btn-outline">
                      <FaLock className="me-2" /> Reset Password
                    </Link>
                  </div>

                  <h4 className="mt-4">Payment Information</h4>
                  <hr className="user-profile-unique-divider" />
                  <div className="user-profile-unique-alert-info">
                    <small>Note: If you provide any payment information, all payment fields must be filled.</small>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cardName" className="user-profile-unique-form-label">Card Holder Name</label>
                    <input
                      type="text"
                      className={`user-profile-unique-form-control ${formErrors.cardName ? 'is-invalid' : ''}`}
                      id="cardName"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      placeholder="Please enter your name as it appears on the card"
                    />
                    {formErrors.cardName && (
                      <div className="user-profile-unique-invalid-feedback">{formErrors.cardName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="user-profile-unique-form-label">Card Number</label>
                    <input
                      type="text"
                      className={`user-profile-unique-form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="8888 8888 8888 8888"
                      maxLength={19}
                    />
                    {formErrors.cardNumber && (
                      <div className="user-profile-unique-invalid-feedback">{formErrors.cardNumber}</div>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="expiryMonth" className="user-profile-unique-form-label">Expiry Month</label>
                      <input
                        type="text"
                        className={`user-profile-unique-form-control ${formErrors.expiryMonth ? 'is-invalid' : ''}`}
                        id="expiryMonth"
                        name="expiryMonth"
                        value={paymentInfo.expiryMonth}
                        onChange={handlePaymentChange}
                        placeholder="MM"
                        maxLength={2}
                      />
                      {formErrors.expiryMonth && (
                        <div className="user-profile-unique-invalid-feedback">{formErrors.expiryMonth}</div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="expiryYear" className="user-profile-unique-form-label">Expiry Year</label>
                      <input
                        type="text"
                        className={`user-profile-unique-form-control ${formErrors.expiryYear ? 'is-invalid' : ''}`}
                        id="expiryYear"
                        name="expiryYear"
                        value={paymentInfo.expiryYear}
                        onChange={handlePaymentChange}
                        placeholder="YY"
                        maxLength={2}
                      />
                      {formErrors.expiryYear && (
                        <div className="user-profile-unique-invalid-feedback">{formErrors.expiryYear}</div>
                      )}
                    </div>
                    {formErrors.expiryDate && (
                      <div className="col-12 mt-2">
                        <div className="text-danger">{formErrors.expiryDate}</div>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cvv" className="user-profile-unique-form-label">CVV</label>
                    <div className="user-profile-unique-input-group">
                      <input
                        type={showCVV ? "text" : "password"}
                        className={`user-profile-unique-form-control-cvv ${formErrors.cvv ? 'is-invalid' : ''}`}
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123 or 1234"
                        maxLength={4}
                      />
          
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setShowCVV(!showCVV)}
                      >
                        {showCVV ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {formErrors.cvv && (
                        <div className="user-profile-unique-invalid-feedback">{formErrors.cvv}</div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="user-profile-unique-btn-success mt-3"
                  >
                    <FaSave className="me-2" /> Save Changes
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;