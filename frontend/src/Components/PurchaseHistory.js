import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import styles from './PurchaseHistory.module.css';
import { CurrentLoginUser } from './CurrentLoginUser';

const API_BASE_URL = 'http://localhost:5005/api';

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});
    const [reviewExists, setReviewExists] = useState({});
    const [existingReviews, setExistingReviews] = useState({});

    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentLoginUser);

    const userID = currentUser?.userID;

    useEffect(() => {
        if (!userID) {
            navigate('/login');
            return;
        }

        const fetchPurchaseHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/carts/${userID}`);
                const carts = response.data
                    .filter(cart => cart.purchaseDate && !cart.isActive)
                    .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

                const fetchItemDetails = async (productID, quantity) => {
                    const productResponse = await axios.get(`${API_BASE_URL}/products/${productID}`);
                    const reviewResponse = await axios.get(`${API_BASE_URL}/reviews/check?userID=${userID}&productID=${productID}`);
                    return {
                        productID,
                        productName: productResponse.data.productName || `Product ${productID} (Not Found)`,
                        quantity,
                        reviewExists: reviewResponse.data.exists,
                        review: reviewResponse.data.review
                    };
                };

                const fetchCartItems = async (cart) => {
                    const itemEntries = Object.entries(cart.items);
                    return await Promise.all(itemEntries.map(([productID, quantity]) => fetchItemDetails(productID, quantity)));
                };

                const fetchCartDetails = async (cart) => {
                    const items = await fetchCartItems(cart);
                    return { ...cart, items };
                };

                const detailedPurchases = await Promise.all(carts.map(fetchCartDetails));

                // Map review existence and existing reviews
                const reviewExistsMap = {};
                const existingReviewsMap = {};
                detailedPurchases.forEach(purchase => {
                    purchase.items.forEach(item => {
                        const key = `${purchase.CartID}-${item.productID}`;
                        reviewExistsMap[key] = item.reviewExists;
                        if (item.reviewExists && item.review) {
                            existingReviewsMap[key] = item.review; // Store review details
                            // Pre-populate ratings and comments for existing reviews
                            if (item.review.rate) {
                                ratings[key] = item.review.rate.toString();
                            }
                            if (item.review.comment) {
                                comments[key] = item.review.comment;
                            }
                        }
                    });
                });

                setPurchases(detailedPurchases);
                setReviewExists(reviewExistsMap);
                setExistingReviews(existingReviewsMap);
                setRatings(ratings);
                setComments(comments);
            } catch (error) {
                console.error('Error fetching purchase history or reviews:', error);
                setError('Failed to load purchase history or reviews. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchPurchaseHistory();
    }, [userID, navigate]);

    const handleRatingChange = (orderID, productID, value) => {
        setRatings(prev => ({
            ...prev,
            [`${orderID}-${productID}`]: value
        }));
    };

    const handleCommentChange = (orderID, productID, value) => {
        setComments(prev => ({
            ...prev,
            [`${orderID}-${productID}`]: value
        }));
    };

    const handleSubmitReview = async (orderID, productID) => {
        const rate = ratings[`${orderID}-${productID}`];
        const comment = comments[`${orderID}-${productID}`] || '';
        if (!rate) {
            alert('Please select a rating (1-5) before submitting.');
            return;
        }

        try {
            const reviewID = `review_${Date.now()}-${productID}`;
            await axios.post(`${API_BASE_URL}/reviews`, {
                reviewID,
                productID,
                userID,
                comment,
                rate
            });

            const productResponse = await axios.get(`${API_BASE_URL}/products/${productID}`);
            const currentRateCount = productResponse.data.rateCount || 0;
            const currentTotalRate = productResponse.data.totalRate || 0;
            await axios.put(`${API_BASE_URL}/products/${productID}`, {
                rateCount: currentRateCount + 1,
                totalRate: currentTotalRate + parseInt(rate)
            });

            alert('Review submitted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (error) return <div className={styles.errorMessage}>{error}</div>;

    return (
        <div className={styles.historyBackground}>
            <NavBar />
            <div className={styles.historyContainer}>
                <div className={styles.historyHeader}>
                    <h1>Purchase History</h1>
                </div>
                <div className={styles.historySection}>
                    {purchases.length === 0 ? (
                        <p>No purchase history available</p>
                    ) : (
                        purchases.map((purchase) => (
                            <div key={purchase.CartID} className={styles.orderTable}>
                                <h2>Your Order</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order ID:</th>
                                            <td>{purchase.CartID}</td>
                                        </tr>
                                        <tr>
                                            <th>Order Date:</th>
                                            <td>{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className={styles.tableHeader}>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Rating (1-5)</th>
                                            <th>Comment</th>
                                            <th>Action</th>
                                        </tr>
                                        {purchase.items.map((item) => {
                                            const key = `${purchase.CartID}-${item.productID}`;
                                            const existingReview = existingReviews[key];
                                            return (
                                                <tr key={item.productID}>
                                                    <td>{item.productName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>
                                                        {existingReview ? (
                                                            <span className={styles.readOnlyReview}>{existingReview.rate}</span>
                                                        ) : (
                                                            <select
                                                                value={ratings[key] || ''}
                                                                onChange={(e) => handleRatingChange(purchase.CartID, item.productID, e.target.value)}
                                                                className={styles.ratingSelect}
                                                                disabled={reviewExists[key]}
                                                            >
                                                                <option value="">Select Rating</option>
                                                                {[1, 2, 3, 4, 5].map((num) => (
                                                                    <option key={num} value={num}>{num}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {existingReview ? (
                                                            <span className={styles.readOnlyReview}>
                                                                {existingReview.comment || 'No comment'}
                                                            </span>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                value={comments[key] || ''}
                                                                onChange={(e) => handleCommentChange(purchase.CartID, item.productID, e.target.value)}
                                                                placeholder="Add a comment..."
                                                                className={styles.commentInput}
                                                                disabled={reviewExists[key]}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleSubmitReview(purchase.CartID, item.productID)}
                                                            className={reviewExists[key] ? styles.submitButtonDisabled : styles.submitButton}
                                                            disabled={reviewExists[key]}
                                                        >
                                                            {reviewExists[key] ? 'Submitted' : 'Submit'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistory;