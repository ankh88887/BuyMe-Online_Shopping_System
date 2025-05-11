const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewID: { type: String, required: true, unique: true },
    productID: { type: String, required: true },
    userID: { type: String, required: true },
    comment: { type: String },
    rate: { type: Number, required: true },
});



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;