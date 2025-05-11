const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    CartID: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    purchaseDate: { type: String, default: null },
    items: { type: Map, of: Number, default: new Map() },
    totalCost: { type: Number },
    isActive: { type: Boolean, default: true } // New field, defaults to true
});

module.exports = mongoose.model('Cart', cartSchema);