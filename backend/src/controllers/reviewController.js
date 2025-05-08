const Reviews = require('../models/Review');

function reviewConstructor(product) {
    return {
        reviewID: product.reviewID,
        ProductID: product.ProductID,
        userID: product.userID,
        comment: product.comment,
        rate: product.rate,
    };
}

// @desc    Get all Review
// @route   GET /api/reviews/
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Reviews.find({});
        if (reviews) {
            console.log('All reviews:', reviews); // Log all reviews
            res.json({
                reviews: reviews.map((review) => reviewConstructor(review))
            });
        } else {
            console.log('No reviews found'); // Log if no reviews are found
            res.status(404).json({ error: 'Reviews not found' });
        }
    } catch (error) {
        console.error('Error fetching reviews:', error); // Log the error
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc    Get Reviews with productsId
// @route   GET /api/reviews/:products_id
exports.getReviewsByProductsId = async (req, res) => {
    const productID = req.params.products_id; // Get the product ID from the request parameters
    try {
        const reviews = await Reviews.find({ productID: { $regex: productID, $options: 'i' } });

        if (reviews.length > 0) {
            console.log(`Reviews for product ID "${productID}":`, reviews); // Log reviews for the product ID
            res.json({
                reviews: reviews.map((review) => reviewConstructor(review))
            });
        } else {
            console.log(`No reviews found for product ID "${productID}"`); // Log if no reviews are found
            res.status(404).json({ error: 'No reviews found' });
        }
    } catch (error) {
        console.error('Error fetching reviews by product ID:', error); // Log the error
        res.status(500).json({ error: 'Server error' });
    }
};const Review = require('../models/Review');

exports.checkReviewByUserID = async (req, res) => {
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