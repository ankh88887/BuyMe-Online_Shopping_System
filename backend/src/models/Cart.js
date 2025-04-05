const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    CartID: {type: String, required: true, unique: true},
    userID: {type: String, required: true},
    purchaseDate: {type: String},
    items: {type: Map, of: Number}
});

cartSchema.methods.getCartID = function(){
    return this.CartID;
};

cartSchema.methods.getUser = function(){
    return this.userID;
};


cartSchema.methods.getPurchaseDate = function(){
    return this.purchaseDate;
};

cartSchema.methods.setPurchaseDate = function(purchaseDate){
    this.purchaseDate = purchaseDate;
};

cartSchema.methods.getItems = function(){
    return this.items;
};


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;