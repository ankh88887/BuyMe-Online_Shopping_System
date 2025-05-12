const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/', cartController.createCart);
router.get('/active/:userId', cartController.getActiveCart);
router.get('/:userId', cartController.getAllCarts);
router.put('/:userId', cartController.updateCart);

module.exports = router;