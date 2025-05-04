import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import styles from './PurchaseHistory.module.css';

const API_BASE_URL = 'http://localhost:5005';

const PurchaseHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});

    const userID = localStorage.getItem('userID') || 'user123';

    const fetchOrdersAndProducts = async () => {
        setLoading(true);
        try {
            const cartResponse = await axios.get(`${API_BASE_URL}/carts/${userID}`);
            const allCarts = cartResponse.data;

            const completedCarts = Array.isArray(allCarts)
                ? allCarts.filter(cart => cart.purchaseDate)
                : allCarts.purchaseDate
                ? [allCarts]
                : [];

            const ordersWithDetails = [];
            for (const cart of completedCarts) {
                const itemsMap = new Map(Object.entries(cart.items || {}));
                const itemsWithDetails = [];

                for (const [productID, quantity] of itemsMap) {
                    try {
                        const productResponse = await axios.get(`${API_BASE_URL}/products/${productID}`);
                        const product = productResponse.data;
                        itemsWithDetails.push({
                            productID,
                            name: product.productName,
                            quantity,
                        });
                    } catch (error) {
                        console.error(`Error fetching product ${productID}:`, error);
                    }
                }

                ordersWithDetails.push({
                    cartID: cart.CartID,
                    purchaseDate: cart.purchaseDate,
                    items: itemsWithDetails,
                });
            }

            setOrders(ordersWithDetails);
        } catch (error) {
            console.error('Error fetching purchase history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdersAndProducts();
    }, [userID]);

    const handleRatingChange = (productID, cartID, value) => {
        setRatings(prev => ({ ...prev, [`${productID}_${cartID}`]: value }));
    };

    const handleCommentChange = (productID, cartID, value) => {
        setComments(prev => ({ ...prev, [`${productID}_${cartID}`]: value }));
    };

    const handleSubmitReview = async (productID, cartID) => {
        const rating = ratings[`${productID}_${cartID}`];
        const comment = comments[`${productID}_${cartID}`] || '';

        if (!rating) {
            alert('Please select a rating before submitting.');
            return;
        }

        try {
            const reviewID = `review_${productID}_${cartID}_${Date.now()}`;
            await axios.post(`${API_BASE_URL}/reviews`, {
                reviewID,
                ProductID: productID,
                userID,
                comment,
                rate: parseInt(rating, 10),
            });

            const productResponse = await axios.get(`${API_BASE_URL}/products/${productID}`);
            const product = productResponse.data;
            const newRateCount = product.rateCount + 1;
            const newTotalRate = product.totalRate + parseInt(rating, 10);
            await axios.put(`${API_BASE_URL}/products/${productID}`, {
                rateCount: newRateCount,
                totalRate: newTotalRate,
            });

            alert('Review submitted successfully!');
            setRatings(prev => ({ ...prev, [`${productID}_${cartID}`]: undefined }));
            setComments(prev => ({ ...prev, [`${productID}_${cartID}`]: undefined }));
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.historyBackground}>
            <NavBar />
            <div className={styles.historyContainer}>
                <div className={styles.historyHeader}>
                    <h1>(1770 x 860) Purchase History</h1>
                </div>
                <div className={styles.historySection}>
                    {orders.length === 0 ? (
                        <p>No purchase history available.</p>
                    ) : (
                        orders.map(order => (
                            <div key={order.cartID} className={styles.orderBlock}>
                                <h3>Your order:</h3>
                                <p>(1770 x 310) List of the order details</p>
                                <p><strong>Order ID:</strong> {order.cartID}</p>
                                <p><strong>Order Date:</strong> {order.purchaseDate}</p>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Rate (1-5)</th>
                                            <th>Comment</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map(item => (
                                            <tr key={`${item.productID}_${order.cartID}`}>
                                                <td>{item.name}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    <select
                                                        value={ratings[`${item.productID}_${order.cartID}`] || ''}
                                                        onChange={(e) =>
                                                            handleRatingChange(item.productID, order.cartID, e.target.value)
                                                        }
                                                    >
                                                        <option value="">Select</option>
                                                        {[1, 2, 3, 4, 5].map(num => (
                                                            <option key={num} value={num}>{num}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={comments[`${item.productID}_${order.cartID}`] || ''}
                                                        onChange={(e) =>
                                                            handleCommentChange(item.productID, order.cartID, e.target.value)
                                                        }
                                                        className={styles.commentInput}
                                                        placeholder="Add a comment"
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        className={styles.submitButton}
                                                        onClick={() => handleSubmitReview(item.productID, order.cartID)}
                                                    >
                                                        Submit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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