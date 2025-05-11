const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

const {
  getReviews,
  getReviewsByProductsId,
  checkReviewByUserID,
  createReview
} = require('../controllers/reviewController');

// POST /reviews - Create a new review

router.post('/', createReview);
router.get('/check', checkReviewByUserID);
router.get('/', getReviews)
router.get('/:products_id', getReviewsByProductsId)

module.exports = router