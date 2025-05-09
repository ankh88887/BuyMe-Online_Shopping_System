const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Get user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    // Get the user ID from the request parameters
    const userID = req.params.id;
      
    const user = await User.findOne({ userID: userID });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
    // Get payment information if exists
    const payment = await Payment.findOne({ userID: user.userID });
    
    // Create response object with user data
    const userData = {
      userID: user.userID,
      username: user.userName,
      email: user.email,
      address: user.address || '',
      isAdmin: user.isAdmin
    };

    // Add payment data if available
    if (payment) {
      userData.cardName = payment.CardOwner;
      userData.cardNumber = payment.CDNo.toString();
      
      // Split expiry date into month and year
      const expiryParts = payment.expiryDate.split('/');
      userData.expiryMonth = expiryParts[0] || '';
      userData.expiryYear = expiryParts[1] || '';
      
      userData.cvv = payment.CVV.toString();
    } else {
      // Default empty payment data
      userData.cardName = '';
      userData.cardNumber = '';
      userData.expiryMonth = '';
      userData.expiryYear = '';
      userData.cvv = '';
    }

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user profile
router.post('/profile', async (req, res) => {
  try {
    const { userID, username, email, address, cardName, cardNumber, expiryMonth, expiryYear, cvv } = req.body;

    // Validate required fields
    if (!userID) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Find user
    const user = await User.findOne({ userID: userID });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if username is being changed and is unique
    if (username && username !== user.userName) {
      const existingUser = await User.findOne({ 
        userName: username,
        userID: { $ne: user.userID }
      });
      
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Username already exists' });
      }
      user.userName = username;
    }

    // Check if email is being changed and is unique
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ 
        email: email,
        userID: { $ne: user.userID }
      });
      
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
      user.email = email;
    }

    // Update address if provided
    if (address !== undefined) {
      user.address = address;
    }

    // Save user changes
    await user.save();

    // Update or create payment information if all payment fields are provided
    if (cardName && cardNumber && expiryMonth && expiryYear && cvv) {
      let payment = await Payment.findOne({ userID: userID });
      
      // Remove any spaces from card number
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      
      if (payment) {
        // Update existing payment
        payment.CardOwner = cardName;
        payment.CDNo = parseInt(cleanCardNumber);
        payment.expiryDate = `${expiryMonth}/${expiryYear}`;
        payment.CVV = parseInt(cvv);
      } else {
        // Create new payment
        payment = new Payment({
          userID: user.userID,
          CardOwner: cardName,
          CDNo: parseInt(cleanCardNumber),
          expiryDate: `${expiryMonth}/${expiryYear}`,
          CVV: parseInt(cvv)
        });
      }
      
      await payment.save();
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Change password
router.post('/change-password', async (req, res) => {
  try {
    const { userID, currentPassword, newPassword } = req.body;
    
    if (!userID) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    // Find user
    const user = await User.findOne({ userID: userID });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save user with new password
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;