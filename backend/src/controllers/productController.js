const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
    try {
        const { productID, productName, productImageDir, price, description, stock } = req.body;
        const product = new Product({ productID, productName, productImageDir, price, description, stock });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Server error');
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ productID: req.params.id });
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).send('Server error');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { rateCount, totalRate } = req.body;
        const product = await Product.findOneAndUpdate(
            { productID: req.params.id },
            { rateCount, totalRate },
            { new: true }
        );
        if (!product) return res.status(404).send('Product not found');
        res.send(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Server error');
    }
};