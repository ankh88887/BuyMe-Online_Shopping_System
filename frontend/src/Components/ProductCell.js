import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductCell.module.css';

export default function ProductCell({ productJSON }) {
    const [product, setProduct] = useState(null)
    
    useEffect(() => {
        setProduct(productJSON);
    }, [productJSON])

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
                <p className={styles.productDetail}>Rate: {product.rateCount !== 0 ? (product.totalRate / product.rateCount).toFixed(1) : "no comment yet"}</p>
                <p className={styles.productDetail}>{product.description}</p>
            </div>
        </div>
    )
}