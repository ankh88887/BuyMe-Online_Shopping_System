const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    CDNo: {type: String, required: true},
    expiryDate: {type: String, required: true},
    CVV:{type: String, required: true},
    CardOwner:{ type: String, required: true}
});

paymentSchema.methods.getUserID = function(){
    return this.userID;
};

paymentSchema.methods.setUserID = function(userID){
    this.userID = userID;
};

paymentSchema.methods.getCDNo = function(){
    return this.CDNo;
};

paymentSchema.methods.setCDNo = function(CDNo){
    this.CDNo = CDNo;
};

paymentSchema.methods.getExpiryDate = function(){
    return this.expiryDate;
};

paymentSchema.methods.setExpirayDate = function(expiryDate){
    this.expiryDate = expiryDate;
};

paymentSchema.methods.getCVV = function(){
    return this.CVV;
};

paymentSchema.methods.setCVV = function(CVV){
    this.CVV = CVV;
};

paymentSchema.methods.getCardOwner = function(){
    return this.CardOwner;
};

paymentSchema.methods.setCardOwner = function(CardOwner){
    this.CardOwner = CardOwner;
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;