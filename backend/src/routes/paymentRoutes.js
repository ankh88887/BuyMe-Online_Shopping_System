const express = require('express');
const Payment = require('../models/Payment');
const router = express.Router();

// Get payment details for a user
router.get('/:userId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ userID: req.params.userId });
    if (!payment) return res.status(404).send('Payment not found');
    res.send(payment);
  } catch (error) {
    console.error('Error fetching payment details:', error); 
    res.status(500).send('Server error');
  }
});

// Update payment details for a user
router.put('/:userId', async (req, res) => {
  try {
    const { CDNo, expiryDate, CVV, CardOwner } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { userID: req.params.userId },
      { CDNo, expiryDate, CVV, CardOwner },
      { new: true, upsert: true }
    );
    res.send(payment);
  } catch (error) {
    console.error('Error updating payment details:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;