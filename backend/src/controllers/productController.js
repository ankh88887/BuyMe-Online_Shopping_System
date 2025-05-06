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
};