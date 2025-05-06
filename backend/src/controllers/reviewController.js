const Review = require('../models/Review');

exports.checkReview = async (req, res) => {
    try {
        const { userID, productID } = req.query;
        const existingReview = await Review.findOne({ userID, ProductID: productID });
        res.json({ exists: !!existingReview });
    } catch (error) {
        console.error('Error checking review:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { reviewID, ProductID, userID, comment, rate } = req.body;
        const review = new Review({ reviewID, ProductID, userID, comment, rate });
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).send('Server error');
    }
};