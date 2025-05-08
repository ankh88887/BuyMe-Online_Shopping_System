const Product = require('../models/Product');

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ productID: req.params.productId });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { rateCount, totalRate } = req.body;
        const product = await Product.findOneAndUpdate(
            { productID: req.params.productId },
            { rateCount, totalRate },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { productID, productName } = req.body;
        if (!productID || !productName) {
            return res.status(400).json({ error: 'productID and productName are required' });
        }

        const existingProduct = await Product.findOne({ productID });
        if (existingProduct) {
            return res.status(400).json({ error: 'Product with this ID already exists' });
        }

        const product = new Product({
            productID,
            productName,
            rateCount: 0,
            totalRate: 0
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Server error' });
    }
};const Product = require('../models/Product');

function ProductConstructor(product) {
  return {
    productID: product.productID,
    productName: product.productName,
    productImageDir: product.productImageDir,
    price: product.price,
    description: product.description,
    stock: product.stock,
    rateCount: product.rateCount,
    totalRate: product.totalRate
  };
}

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (products) {
      console.log('Product found:', products); // Log the found product
      res.json({
        products: products.map((product) => (ProductConstructor(product)))
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
    const product = await Product.findOne({ productID: productID }); // Search for the product by productID
    if (product) {
      const constructedProduct = ProductConstructor(product); // Transform the product
      console.log('Product found:', constructedProduct); // Log the transformed product
      res.json(constructedProduct); // Return the transformed product
    } else {
      res.status(404).json({ error: 'Product not found' }); // Handle not found
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' }); // Handle server error
  }
};


// @desc    Get products with keyword
// @route   GET /api/products/search/:keyword
exports.getProductsByKeyword = async (req, res) => {
  const keyword = req.params.keyword.toLowerCase(); // Get the keyword from the request parameters and convert to lowercase
  try {
    // Search for products where the productName or description contains the keyword (case-insensitive)
    const products = await Product.find({ productName: { $regex: keyword, $options: 'i' } });

    if (products.length > 0) {
      console.log(`${products.length} product(s) found with keyword: ${keyword}`); // Log the number of products found
      res.json({
        products: products.map((product) => ProductConstructor(product)) // Transform the products using ProductConstructor
      });
    } else {
      console.log(`No products found with keyword: ${keyword}`); // Log no products found
      res.status(404).json({ error: 'No products found' }); // Handle not found
    }
  } catch (error) {
    console.error('Error fetching products by keyword:', error); // Log the error
    res.status(500).json({ error: 'Server error' }); // Handle server error
  }
};