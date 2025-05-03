const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewID: {type: String, required: true, unique: true},
    ProductID: {type: String, required: true},
    userID: {type: String, requird: true},
    comment: {type: String},
    rate: {type: Number, required: true},
});

reviewSchema.methods.getReviewID = function(){
    return this.reviewID;
};

reviewSchema.methods.getProductID = function(){
    return this.ProductID;
};

reviewSchema.methods.getUserID = function(){
    return this.UserID;
};

reviewSchema.methods.getComment = function(){
    return this.comment;
};

reviewSchema.methods.getRate = function(){
    return this.rate;
};

const Review = mongoose.model('Rewiew', reviewSchema);

module.exports = Review;