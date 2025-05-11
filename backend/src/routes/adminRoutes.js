const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcrypt');
const router = express.Router();

// ==================== USER MANAGEMENT ROUTES ====================

// Get all users (with optional isAdmin filter)
router.get('/users', async (req, res) => {
  try {
    const query = {};
    if (req.query.isAdmin !== undefined) {
      query.isAdmin = req.query.isAdmin === 'true';
    }
    
    const users = await User.find(query);
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving users', error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.params.id });
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving user', error: error.message });
  }
});

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const { userName, password, email, isAdmin } = req.body;
    
    if (!userName || !password || !email || isAdmin === undefined) {
    return res.status(400).send({ message: 'Username, password, email and isAdmin are required' });
    }

    // Check for existing username
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
    return res.status(400).send({ message: 'Username already exists' });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
    return res.status(400).send({ message: 'Email already exists' });
    }

    // Get highest userID with numeric sorting
    const highestUser = await User.findOne({})
    .sort({ userID: -1 })
    .collation({ locale: "en_US", numericOrdering: true });
    
    const nextUserID = highestUser ? parseInt(highestUser.userID) + 1 : 1;
    
    const saltedPassword = await bcrypt.hash(password, 10);

    const user = new User({
    userID: nextUserID.toString(),
    userName,
    password: saltedPassword,
    email,
    isAdmin
    });

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    if (error.code === 11000) {
    if (error.keyPattern.userID) {
        return res.status(400).send({ message: 'User ID conflict. Try again.' });
    }
    if (error.keyPattern.userName) {
        return res.status(400).send({ message: 'Username already exists' });
    }
    if (error.keyPattern.email) {
        return res.status(400).send({ message: 'Email already exists' });
    }
    }
    res.status(500).send({ message: 'Error creating user', error: error.message });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { userName, password, email, isAdmin, address } = req.body;
    
    const user = await User.findOne({ userID: req.params.id });
    if (!user) {
    return res.status(404).send({ message: 'User not found' });
    }
      
    // Check username uniqueness if changing
    if (userName && userName !== user.userName) {
    const existingUser = await User.findOne({ 
        userName: userName,
        _id: { $ne: user._id } // Exclude current user
    });
    if (existingUser) {
        return res.status(400).send({ message: 'Username already exists' });
    }
    user.userName = userName;
    }
      
    // Check email uniqueness if changing
    if (email && email !== user.email) {
    const existingEmail = await User.findOne({ 
        email: email,
        _id: { $ne: user._id } // Exclude current user
    });
    if (existingEmail) {
        return res.status(400).send({ message: 'Email already exists' });
    }
    user.email = email;
    }
      
    if (password) {
      const saltedPassword = await bcrypt.hash(password, 10);
      user.password = saltedPassword;
    }
    
    if (email !== undefined) {
      user.email = email;
    }
    
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }
    
    if (address !== undefined) {
      user.address = address;
    }
    
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: 'Error updating user', error: error.message });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findOne({ userID: req.params.id });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    
    await User.deleteOne({ userID: req.params.id });
    res.send({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting user', error: error.message });
  }
});

// ==================== PRODUCT MANAGEMENT ROUTES ====================

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving products', error: error.message });
  }
});

// Create a new product
router.post('/products', async (req, res) => {
  try {
    const { productName, price, stock, description } = req.body;
    
    if (!productName || !price || !stock || !description) {
    return res.status(400).send({ message: 'Missing required fields' });
    }

    // Get highest productID with numeric sorting
    const highestProduct = await Product.findOne({})
    .sort({ productID: -1 })
    .collation({ locale: "en_US", numericOrdering: true });
    
    const nextProductID = highestProduct ? parseInt(highestProduct.productID) + 1 : 1;

    const product = new Product({
    productID: nextProductID.toString(),
    productName,
    price,
    stock,
    description,
    });

    await product.save();
    res.status(201).send(product);
  } catch (error) {
    if (error.code === 11000) {
    return res.status(400).send({ message: 'Product ID conflict. Try again.' });
    }
    res.status(500).send({ message: 'Failed to create product', error: error.message });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const productID = req.params.id;
    
    if (!productID) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    
    const product = await Product.findOne({ productID });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    
    res.send(product);
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve product', error: error.message });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  try {
    const productID = req.params.id;
    const { productName, price, stock, description } = req.body;
    
    const product = await Product.findOne({ productID });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    
    if (productName) {
      product.productName = productName;
    }
    if (price) {
      product.price = price;
    }
    if (stock) {
      product.stock = stock;
    }
    if (description) {
      product.description = description;
    }
    
    product.updatedAt = new Date();
    
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update product', error: error.message });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const productID = req.params.id;
    
    if (!productID) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    
    const product = await Product.findOneAndDelete({ productID });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    
    res.send({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete product', error: error.message });
  }
});

module.exports = router;