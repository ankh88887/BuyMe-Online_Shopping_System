const express = require('express');
const router = express.Router();

const {
  LoginUser,
  RegisterUser,
  ForgetPassword,
  getUserByUsername,
  getUsers,
  getUserById,,
  getUserById
} = require('../controllers/userController');

router.post('/login', LoginUser);
router.post('/register', RegisterUser);
router.put('/forget-password/', ForgetPassword);
router.get('/search/:userName', getUserByUsername);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/:id', getUserById)

module.exports = router;