import { useEffect, useState } from 'react'
import styles from './ProductReview.module.css';

export default function ProductContainer({ productID }) {
    // const [product, setProduct] = useState(null)
    // const fetchProduct = async (productID) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/api/product/${productID}`) // Backend API
    //         if (!response.ok) {
    //             throw new Error('Product not found')
    //         }
    //         const productData = await response.json()
    //         setProduct(productData); // Update state with product data
    //     } catch (error) {
    //         console.error('Error fetching product:', error)
    //     }
    // }

    // useEffect(() => {
    //     fetchProduct(productID) // Fetch product when component mounts
    // }, [productID])

    // if (!product) {
    //     return <p>Loading...</p> // Show loading message while fetching
    // }

    return (
        <h1>
            Review
        </h1>
    )
}