const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductsByKeyword
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/search/:keyword', getProductsByKeyword);

module.exports = router;