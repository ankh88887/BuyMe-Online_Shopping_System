import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCell.module.css';

export default function ProductCell({ productID }) {
    const [product, setProduct] = useState(null)
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

    useEffect(() => {
        fetchProduct(productID) // Fetch product when component mounts
    }, [productID])

    if (!product) {
        return <p>Loading...</p> // Show loading message while fetching
    }
    return (
        <div className={styles.productCell}>
            <Link to={'/product/' + product.productID}>
                <img src={process.env.PUBLIC_URL + '/Images/' + product.productImageDir} alt={product.productName} className={styles.image} />
            </Link>
            <div className={styles.productDetailContainer}>
                <h2 className={styles.productName}>{product.productName} ${product.price} </h2>
                <p className={styles.productDetail}>Rate: {product.rateCount !== 0 ? product.totalRate / product.rateCount : "no comment yet"}</p>
                <p className={styles.productDetail}>{product.description}</p>
            </div>
        </div>
    )
}