const express = require('express');
const router = express.Router();

const {
  LoginUser,
  RegisterUser,
  ForgetPassword,
  getUserByUsername
} = require('../controllers/userController');

router.post('/login', LoginUser);
router.post('/register', RegisterUser);
router.put('/forget-password/', ForgetPassword);
router.get('/search/:userName', getUserByUsername);

module.exports = router;