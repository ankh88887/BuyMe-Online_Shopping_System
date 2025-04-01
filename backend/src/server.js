const express = require('express');
const fs = require('fs').promises;
const cors = require('cors'); // To allow requests from the frontend
const app = express();
const PORT = 5000;

let products = [];

// Load products from JSON file
const initializeProducts = async () => {
    try {
        const data = await fs.readFile('./src/ProductData.json', 'utf-8'); // Path to your JSON file
        const parsedData = JSON.parse(data); // Parse JSON into an object
        products = parsedData.Product || []; // Extract the "Product" array or default to an empty array
        console.log('Products loaded:', products);
    } catch (error) {
        console.error('Error reading JSON file:', error);
    }
};

// Middleware
app.use(cors()); // Enable CORS for frontend requests

// API endpoint to get a product by ID
app.get('/api/product/:id', (req, res) => {
    const productID = req.params.id;
    product = null; // Initialize product variable
    products.forEach(p => {
        if (p.id == productID)
            product = p; // Find product by ID
    }
    )
    if (product) {
        console.log('Product found:', product); // Log the found product
        res.json(product); // Return the product
    } else {
        res.status(404).json({ error: 'Product not found' }); // Handle not found
    }
});

// Start the server
app.listen(PORT, async () => {
    await initializeProducts(); // Load products on server start
    console.log(`Backend API is running on http://localhost:${PORT}`);
});