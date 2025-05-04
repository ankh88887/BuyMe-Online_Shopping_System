const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
      const products = await Product.find({});
      if (products) {
          console.log('Product found:', products); // Log the found product
          res.json({
            products: products.map((product) => ({
              productID: product.productID,
              productName: product.productName,
              productImageDir: product.productImageDir,
              price: product.price,
              description: product.description,
              stock: product.stock,
              rateCount: product.rateCount,
              totalRate: product.totalRate
            }))
          })
      } else {
          res.status(404).json({ error: 'Product not found' }); // Handle not found
      }
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Server error' }); // Handle server error
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  const productID = req.params.id; // Get the productID from the request parameters
  try {
      // Search for the product by productID instead of _id
      const product = await Product.findOne({ productID: productID });
      if (product) {
          console.log('Product found:', product); // Log the found product
          res.json({
              productID: product.productID,
              productName: product.productName,
              productImageDir: product.productImageDir,
              price: product.price,
              description: product.description,
              stock: product.stock,
              rateCount: product.rateCount,
              totalRate: product.totalRate
            })
      } else {
          res.status(404).json({ error: 'Product not found' }); // Handle not found
      }
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Server error' }); // Handle server error
  }
};