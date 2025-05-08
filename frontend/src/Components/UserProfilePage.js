import React, { useContext, useState, useEffect } from "react";
import { CurrentLoginUser } from "./CurrentLoginUser";
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import './UserProfilePage.css';

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

  useEffect(() => {
    // Fetch user profile data when component mounts
    if (currentUser) {
      fetchUserProfile();
    } else {
      // Redirect to login if no user is logged in
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const fetchUserProfile = async () => {
    try {
      // Use the API endpoint from your routes with fetch
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
  };

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
    }
    // Clear any previous messages
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
    setPaymentInfo({
      ...paymentInfo,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Combine profile and payment data for submission
      const profileData = {
        userID: currentUser.userID,
        username: editedProfile.username,
        email: editedProfile.email,
        address: editedProfile.address,
        ...paymentInfo
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
        // Refresh user data after successful update
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
      <div className="container mt-5">
        <p>Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>User Profile</h3>
              {!isEditing ? (
                <button className="btn btn-primary" onClick={handleEditToggle}>
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={handleEditToggle}>
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {!isEditing ? (
                <div>
                  <div className="row mb-3">
                    <div className="col-md-4 fw-bold">User ID:</div>
                    <div className="col-md-8">{userProfile.userID}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 fw-bold">Username:</div>
                    <div className="col-md-8">{userProfile.username}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 fw-bold">Email:</div>
                    <div className="col-md-8">{userProfile.email}</div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-4 fw-bold">Address:</div>
                    <div className="col-md-8">{userProfile.address || "No address provided"}</div>
                  </div>
                  
                  <h4 className="mt-4">Payment Information</h4>
                  {userProfile.cardNumber ? (
                    <>
                      <div className="row mb-3">
                        <div className="col-md-4 fw-bold">Card Holder:</div>
                        <div className="col-md-8">{userProfile.cardName}</div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-4 fw-bold">Card Number:</div>
                        <div className="col-md-8">**** **** **** {userProfile.cardNumber.slice(-4)}</div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-4 fw-bold">Expiry Date:</div>
                        <div className="col-md-8">{userProfile.expiryMonth}/{userProfile.expiryYear}</div>
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
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={editedProfile.username || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={editedProfile.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      name="address"
                      value={editedProfile.address || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <h4 className="mt-4">Payment Information</h4>
                  <div className="mb-3">
                    <label htmlFor="cardName" className="form-label">Card Holder Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardName"
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardNumber"
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="expiryMonth" className="form-label">Expiry Month</label>
                      <input
                        type="text"
                        className="form-control"
                        id="expiryMonth"
                        name="expiryMonth"
                        value={paymentInfo.expiryMonth}
                        onChange={handlePaymentChange}
                        placeholder="MM"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="expiryYear" className="form-label">Expiry Year</label>
                      <input
                        type="text"
                        className="form-control"
                        id="expiryYear"
                        name="expiryYear"
                        value={paymentInfo.expiryYear}
                        onChange={handlePaymentChange}
                        placeholder="YY"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cvv" className="form-label">CVV</label>
                    <div className="input-group">
                      <input
                        type={showCVV ? "text" : "password"}
                        className="form-control"
                        id="cvv"
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => setShowCVV(!showCVV)}
                      >
                        {showCVV ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-success mt-3">
                    <FaSave /> Save Changes
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
