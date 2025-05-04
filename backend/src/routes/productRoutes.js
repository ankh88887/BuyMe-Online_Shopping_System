const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

const {
  getProducts,
  getProductById
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;