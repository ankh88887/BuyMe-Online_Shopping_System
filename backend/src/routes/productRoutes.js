const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products/:productId - Fetch a product by ID
router.get('/:productId', productController.getProductById);

// PUT /products/:productId - Update a product (e.g., for ratings)
router.put('/:productId', productController.updateProduct);

// POST /products - Create a new product
router.post('/', productController.createProduct);

module.exports = router;