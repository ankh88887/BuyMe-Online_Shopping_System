const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    CartID: {type: String, required: true, unique: true},
    userID: {type: String, required: true},
    purchaseDate: {type: String},
    items: {type: Map, of: Number},
    totalCost: {type: Number},
    status: { type: String, enum: ['active', 'completed'], default: 'active' }
});



const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;