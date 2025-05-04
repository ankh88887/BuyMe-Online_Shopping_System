import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductContainer from "./ProductContainer"
import ProductReview from "./ProductReview"

export default function ProductData() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [reviews, setReviews] = useState(null)

    const fetchProduct = async (productID) => {
        try {
            const response = await fetch(`http://localhost:5005/api/products/${productID}`) // Backend API
            if (!response.ok) {
                throw new Error('Product not found')
            }
            const productData = await response.json()
            setProduct(productData); // Update state with product data
        } catch (error) {
            console.error('Error fetching product:', error)
        }
    }

    const fetechreview = async (productID) => {
        try {
            console.log("Fetching reviews with product ID:", productID)
            const response = await fetch(`http://localhost:5005/api/reviews/${productID}`)
            if (!response.ok) {
                throw new Error("Product not found")
            }
            const reviewsData = await response.json()
            console.log("Reviews data fetched:", reviewsData)

            const reviewsWithUsername = await Promise.all(
                reviewsData.reviews.map(async (review) => {
                    try {
                        console.log("Fetching user with user ID:", review.userID);
                        const userResponse = await fetch(`http://localhost:5005/api/users/${review.userID}`);
                        if (!userResponse.ok) {
                            throw new Error("User not found");
                        }
                        const user = await userResponse.json();
                        console.log("User data fetched:", user);

                        // Return the new review with userName
                        return {
                            ...review,
                            userName: user.userName,
                        };
                    } catch (error) {
                        console.error("Error fetching user:", error);

                        return {
                            ...review,
                            userName: "Unknown",
                        };
                    }
                })
            );

            setReviews(reviewsWithUsername);
            console.log("All new Reviews:", reviewsWithUsername);
        } catch (error) {
            console.error("Error fetching review:", error)
            setReviews([])
        }
    }

    useEffect(() => {
        fetchProduct(id) // Fetch product when component mounts
        fetechreview(id) // Fetch review when component mounts        
    }, [])

    if (!product) {
        return <p>Loading...</p> // Show loading message while fetching
    }

    return (
        <div >
            <ProductContainer productJSON={product} />
            <ProductReview reviewsJSON={reviews} />
        </div>
    )
}