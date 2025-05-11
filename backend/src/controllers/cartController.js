const Cart = require('../models/Cart');

const createCart = async (req, res) => {
    try {
        const { CartID, userID, items, totalCost, purchaseDate, isActive } = req.body;

        if (!CartID || !userID || !items || totalCost === undefined) {
            return res.status(400).json({ error: 'Missing required fields: CartID, userID, items, and totalCost are required' });
        }

        const cart = new Cart({
            CartID,
            userID,
            purchaseDate: purchaseDate || null,
            items,
            totalCost,
            isActive: isActive !== undefined ? isActive : true // Default to true when created
        });
        await cart.save();
        res.status(201).send(cart);
    } catch (error) {
        console.error('Error creating cart:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'CartID must be unique' });
        }
        res.status(500).json({ error: 'Server error' });
    }
};

const getActiveCart = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(`Searching for active cart with userID: ${userId}`);

        let cart = await Cart.findOne({
            userID: { $regex: `^${userId}$`, $options: 'i' },
            isActive: true
        });

        if (!cart) {
            console.log('No active cart found, checking all carts for user');
            const allCarts = await Cart.find({
                userID: { $regex: `^${userId}$`, $options: 'i' }
            });
            cart = allCarts.find(c => c.isActive) || null;

            if (!cart) {
                console.log('No suitable cart found, creating new cart');
                const newCart = new Cart({
                    CartID: `cart_${Date.now()}`,
                    userID: userId,
                    items: new Map(),
                    purchaseDate: null,
                    isActive: true
                });
                await newCart.save();
                console.log('New cart created:', newCart);
                return res.send(newCart);
            }
        }

        console.log('Returning existing cart:', cart);
        res.send(cart);
    } catch (error) {
        console.error('Error fetching active cart:', error);
        res.status(500).json({ error: 'An error occurred while fetching the cart. Please try again later.' });
    }
};

const getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find({ userID: req.params.userId });
        res.send(carts);
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ error: 'An error occurred while fetching carts. Please try again later.' });
    }
};

const updateCart = async (req, res) => {
    try {
        const { items, totalCost, purchaseDate, isActive } = req.body;
        const updateData = {
            items: new Map(Object.entries(items)),
        };
        if (totalCost !== undefined) updateData.totalCost = totalCost;
        if (purchaseDate !== undefined) updateData.purchaseDate = purchaseDate;
        if (isActive !== undefined) updateData.isActive = isActive;

        const cart = await Cart.findOneAndUpdate(
            { userID: req.params.userId, isActive: true },
            updateData,
            { new: true }
        );
        if (!cart) return res.status(404).send('Cart not found');
        res.send(cart);
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ error: 'An error occurred while updating the cart. Please try again later.' });
    }
};

module.exports = {
    createCart,
    getActiveCart,
    getAllCarts,
    updateCart
};