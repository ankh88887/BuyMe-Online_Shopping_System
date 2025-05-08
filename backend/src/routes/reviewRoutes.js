const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET /reviews/check - Check if a review exists for a user and product




const {
  getReviews,
  getReviewsByProductsId
} = require('../controllers/reviewController');

// POST /reviews - Create a new review
router.post('/', reviewController.createReview);
router.get('/', getReviews)
router.get('/check', reviewController.checkReviewByUserID);
router.get('/:products_id', getReviewsByProductsId)

module.exports = router