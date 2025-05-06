const express = require('express');
const router = express.Router();
// We'll create these controller functions next
const { 
  registerUser, 
  loginUser, 
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
//router.get('/profile', protect, getUserProfile);
//router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);


module.exports = router;
