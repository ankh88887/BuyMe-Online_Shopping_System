const express = require('express');
const User = require('../models/User');
const Event = require('../models/Product'); // Make sure you have this model created
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
    
    const existing = await User.findOne({ userName });
    if (existing) {
      return res.status(400).send({ message: 'Username already exists' });
    }
    
    const saltedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      userID: generateUserID(),
      userName,
      password: saltedPassword,
      email,
      isAdmin
    });
    
    await user.save();
    res.status(201).send(user);
  } catch (error) {
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
    
    if (userName && userName !== user.userName) {
      const existingUser = await User.findOne({ userName });
      if (existingUser) {
        return res.status(400).send({ message: 'Username already exists' });
      }
      user.userName = userName;
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

// ==================== EVENT MANAGEMENT ROUTES ====================

// Create a new event
router.post('/products', async (req, res) => {
  try {
    const { productID, productName, price, stock, description } = req.body;
    
    if (!productID || !productName || !price || !stock || !description) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    
    const updatedAt = new Date();
    
    const product = new Product({
      productID,
      productName,
      price,
      stock,
      description
    });
    
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send({ message: 'Failed to create product', error: error.message });
  }
});

// Get events by ID
router.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    
    const products = await Product.find({ productId });
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: 'Failed to retrieve events', error: error.message });
  }
});

// Update an event
router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { productID, productName, price, stock, description } = req.body;
    
    const product = await Event.findOne({ productId });
    if (!products) {
      return res.status(404).send({ message: 'Product not found' });
    }
    
    const updatedAt = new Date();
    
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
    
    product.updatedAt = updatedAt;
    
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).send({ message: 'Failed to update product', error: error.message });
  }
});

// Delete an event
router.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    if (!productId) {
      return res.status(400).send({ message: 'Missing required fields' });
    }
    
    const product = await Event.findOneAndDelete({ productId });
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    
    res.send({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).send({ message: 'Failed to delete product', error: error.message });
  }
});

// Helper function to generate a unique userID
function generateUserID() {
  return 'u' + Math.floor(1000 + Math.random() * 9000);
}

module.exports = router;
