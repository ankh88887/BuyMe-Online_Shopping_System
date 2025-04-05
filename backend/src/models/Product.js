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
productSchema.methods.getProductID = function () {
    return this.productID;
};
  
productSchema.methods.getProductName = function () {
    return this.productName;
};
  
productSchema.methods.setProductName = function (newProductName) {
    this.productName = newProductName;
};

productSchema.methods.getProductImageDir = function() {
    return this.productImageDir;
};

productSchema.methods.setProductImageDir = function(productImageDir) {
    this.productImageDir = productImageDir;
};

productSchema.methods.getPrice = function(){
    return this.price;
};

productSchema.methods.setPrice = function(price) {
    this.price = price;
};

productSchema.methods.getDescription = function(){
    return this.description;
};

productSchema.methods.setDescription = function(description){
    this.description = description;
};

productSchema.methods.getSock = function(){
    return this.stock;
};

productSchema.methods.setSock = function(stock){
    this.stock = stock;
};

productSchema.methods.getRateCount = function(){
    return this.rateCount;
};

productSchema.methods.setRateCount = function(rateCount){
    this.rateCount = rateCount;
};

productSchema.methods.getTotalRate = function(){
    return this.totalRate;
};

productSchema.methods.setTotalRate = function(totalRate){
    this.totalRate = totalRate;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;