const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  getUserByUsername
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/search/:userName', getUserByUsername);

module.exports = router;