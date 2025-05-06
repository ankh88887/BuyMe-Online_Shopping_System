const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET /reviews/check - Check if a review exists for a user and product
router.get('/check', reviewController.checkReview);

// POST /reviews - Create a new review
router.post('/', reviewController.createReview);

module.exports = router;