import { useEffect, useState } from 'react';
import styles from './ProductReview.module.css';

export default function ProductReview({ reviewsJSON }) {
    const [review, setReview] = useState(null);
    const [averageRating, setAverageRating] = useState(0)
    const [ProductTotalRatingCount, setProductTotalRatingCount] = useState(0)

    useEffect(() => {
        setReview(reviewsJSON);
        if (reviewsJSON && reviewsJSON.length > 0) {
            var totalRating = 0
            reviewsJSON.forEach((r) => {
                totalRating += r.rate; // Sum up the ratings
            })
            setAverageRating(totalRating / reviewsJSON.length);
            setProductTotalRatingCount(reviewsJSON.length); // Set the total rating count
        }
    }, [reviewsJSON])

    if (!review) {
        return <p>Loading...</p> // Show loading message while fetching
    }


    return (
        <div>
            { review.length !== 0 ? (
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
                                <p className={styles.reveiwTxt} style={{fontWeight:"bold"}}>{r.userName}</p>
                                {Array.from({ length: r.rate }, (_, index) => (
                                    <span key={index} className={styles.ReviewStar}>★</span>
                                ))}
                                {Array.from({ length: (5 - r.rate) }, (_, index) => (
                                    <span key={index} className={styles.ReviewStar}>☆</span>
                                ))}
                                <p className={styles.reveiwTxt} style={{marginBottom: "15px"}}>Comment: {r.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (<h2 style={{ textAlign: "center", marginTop: "20px" }}>
                No reviews yet.
            </h2>
            )
}
        </div>
    );
}