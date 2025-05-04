const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userID, isAdmin, username, password, email, address } = req.body;
  const user = new User({ userID, isAdmin, username, password, email, address });
  await user.save();
  res.status(201).send(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ userID: req.params.id, status: 'active' });
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});

// Update user information
router.put('/:id', async (req, res) => {
  try {
    const { username, email, address} = req.body;
    const user = await User.findOneAndUpdate(
      { userID: req.params.id },
      { username, email, address },
      { new: true }
    );
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;