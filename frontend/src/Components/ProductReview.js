import { useEffect, useState } from 'react';
import styles from './ProductReview.module.css';

export default function ProductReview({ productID }) {
    const [review, setReview] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    // #region dummy data
    const [ProductTotalRating, setProductTotalRating] = useState(0);
    const [ProductTotalRatingCount, setProductTotalRatingCount] = useState(0);
    // #endregion


    // #region dummy data
    const fetchReview = async () => {
        try {
            let reviewData1 = {
                productID: productID,
                user: "reviewData1",
                comment: "This is a great product!",
                rating: 5,
            };
            let reviewData2 = {
                productID: productID,
                user: "reviewData2",
                comment: "Not bad!",
                rating: 4,
            };

            setReview([reviewData1, reviewData2]); // Update the review state
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    // Calculate total rating and count when the review state changes
    useEffect(() => {
        if (review) {
            const totalRating = review.reduce((sum, r) => sum + r.rating, 0);
            const totalCount = review.length;

            setProductTotalRating(totalRating);
            setProductTotalRatingCount(totalCount);
            setAverageRating(totalCount > 0 ? totalRating / totalCount : 0);
        }
    }, [review]);

    useEffect(() => {
        fetchReview(); // Fetch reviews when the component mounts
    }, [productID]);

    if (!review) {
        return <p>Loading...</p>; // Show loading message while fetching
    }
    // #endregion

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={styles.RatingHeader}>Review ({ProductTotalRatingCount})</span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                    {Array.from({ length: Math.floor(averageRating) }, (_, index) => (
                        <span key={index} className={styles.Star}>★</span>
                    ))}
                    {Array.from({ length: (5 - Math.floor(averageRating)) }, (_, index) => (
                        <span key={index} className={styles.Star}>☆</span>
                    ))}
                </span>
                <span className={styles.avgRating}>
                    {averageRating.toFixed(1)} / 5
                </span>
            </div>
            <div style={{ alignItems: "center", display: "flex", flexDirection: "column", gap: "10px" }}>
                {review.map((r, index) => (
                    <div key={index} className={styles.reviewContainer}>
                        <p className={styles.reveiwTxt}>{r.user}</p>
                        {Array.from({ length: r.rating }, (_, index) => (
                            <span key={index} className={styles.ReviewStar}>★</span>
                        ))}
                        {Array.from({ length: (5 - r.rating) }, (_, index) => (
                            <span key={index} className={styles.ReviewStar}>☆</span>
                        ))}
                        <p className={styles.reveiwTxt} style={{marginBottom: "15px"}}>Comment: {r.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}