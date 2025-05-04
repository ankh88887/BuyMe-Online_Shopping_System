const express = require('express');
const router = express.Router();

const {
  getReviews,
  getReviewsByProductsId
} = require('../controllers/reviewController');

router.get('/', getReviews)
router.get('/:products_id', getReviewsByProductsId)

module.exports = router