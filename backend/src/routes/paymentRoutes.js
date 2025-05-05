const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.get('/:id', paymentController.getPayment);
router.put('/:id', paymentController.updatePayment);

module.exports = router;