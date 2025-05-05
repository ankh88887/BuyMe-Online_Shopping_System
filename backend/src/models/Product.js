const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productID: {type: String, required: true, unique: true},
    productName: {type: String, required: true},
    productImageDir: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String},
    stock: {type: Number, default: 0},
    rateCount: {type: Number, default: 0},
    totalRate: {type: Number, default: 0},
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;