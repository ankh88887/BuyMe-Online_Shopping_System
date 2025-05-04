const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

router.post('/', async (req, res) => {
    const { productID, productName, productImageDir, price, description, stock } = req.body;
    const product = new Product({ productID, productName, productImageDir, price, description, stock });
    await product.save();
    res.status(201).send(product);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findOne({ productID: req.params.id });
    if (!product) return res.status(404).send('Product not found');
    res.send(product);
});

router.put('/:id', async (req, res) => {
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
});

module.exports = router;