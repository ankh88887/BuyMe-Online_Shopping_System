const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userID: {type: String, required: true},
    CDNo: {type: Number, required: true},
    expiryDate: {type: String, required: true},
    CVV:{type: Number, required: true},
    CardOwner:{ type: String, required: true}
});


const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;