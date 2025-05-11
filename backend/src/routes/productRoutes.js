const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductsByKeyword,
  createProduct,
  updateProduct
} = require('../controllers/productController');
const { updateCart } = require('../controllers/cartController');


router.post('/', createProduct)
router.put('/:id', updateProduct)
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/search/:keyword', getProductsByKeyword);

module.exports = router;