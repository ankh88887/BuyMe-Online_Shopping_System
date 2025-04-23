import { useEffect, useState } from 'react'
import AddToCart from './AddToCartBtn'
import styles from './ProductContainer.module.css';

export default function ProductContainer({ productID }) {
    const [product, setProduct] = useState(null)
    const fetchProduct = async (productID) => {
        try {
            const response = await fetch(`http://localhost:5000/api/product/${productID}`) // Backend API
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
        <div className={styles.productContainer}>
            <p className={styles.productName}>{product.name}</p>
            <div className={styles.productDetails}>
                <img src={process.env.PUBLIC_URL + '/Images/' + product.image} alt={product.name} />
                <table>
                    <tbody>
                        <tr height="70px">
                            <td width="200px">Price:</td>
                            <td>${product.price}</td>
                        </tr>
                        <tr height="70px">
                            <td>Stock:</td>
                            <td>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <span>Not in stock</span>
                                    <AddToCart productID={productID} />
                                </div>
                            </td>
                        </tr>
                        <tr style={{verticalAlign: "top"}}>
                            <td>Description:</td>
                            <td>{product.description}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}