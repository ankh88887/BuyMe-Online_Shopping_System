const Cart = require('../models/Cart');

exports.createCart = async (req, res) => {
    try {
        const { CartID, userID, items, totalCost } = req.body;
        const purchaseDate = new Date().toISOString().split('T')[0];
        const cart = new Cart({ CartID, userID, purchaseDate, items, totalCost });
        await cart.save();
        res.status(201).send(cart);
    } catch (error) {
        console.error('Error creating cart:', error);
        res.status(500).send('Server error');
    }
};

exports.getActiveCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userID: req.params.userId, purchaseDate: null });
        if (!cart) {
            const newCart = new Cart({
                CartID: `cart_${Date.now()}`,
                userID: req.params.userId,
                items: new Map(),
            });
            await newCart.save();
            return res.send(newCart);
        }
        res.send(cart);
    } catch (error) {
        console.error('Error fetching active cart:', error);
        res.status(500).json({ error: 'An error occurred while fetching the cart. Please try again later.' });
    }
};

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find({ userID: req.params.userId });
        res.send(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ error: 'An error occurred while fetching carts. Please try again later.' });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { items } = req.body;
        const cart = await Cart.findOneAndUpdate(
            { userID: req.params.userId, purchaseDate: null },
            { items: new Map(Object.entries(items)) },
            { new: true }
        );
        if (!cart) return res.status(404).send('Cart not found');
        res.send(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'An error occurred while updating the cart. Please try again later.' });
    }
};