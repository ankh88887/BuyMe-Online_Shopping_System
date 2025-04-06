const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userID, isAdmin, userName, password, email, address } = req.body;
  const user = new User({ userID, isAdmin, userName, password, email, address });
  await user.save();
  res.status(201).send(user);
});

router.get('/:id', async (req, res) => {
  const user = await User.findOne({ userID: req.params.id });
  if (!user) return res.status(404).send('User not found');
  res.send(user);
});

module.exports = router;