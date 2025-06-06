import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SearchProductCell.module.css';
import UpdateCart from './UpdateCartBtn'

export default function SearchProductCell({ productJSON }) {
    const [product, setProduct] = useState(null)
    useEffect(() => {
        setProduct(productJSON);
    }, [productJSON])

    if (!product) {
        return <p>Loading...</p>
    }

    return (
        <div className={styles.productCell}>
            <Link to={'/product/' + product.productID}>
                <img src={process.env.PUBLIC_URL + '/Images/' + product.productImageDir} alt={product.productName} className={styles.image} />
            </Link>
            <div className={styles.productContainer}>
                <div className={styles.productDetailContainer}>
                        <h2 className={styles.productName}>{product.productName} ${product.price} </h2>
                        <p className={styles.productDetail}>Rate: {product.rateCount !== 0 ? (product.totalRate / product.rateCount).toFixed(1) : "no comment yet"}</p>
                        <p className={styles.productDetail}>{product.description}</p>
                </div>
                <UpdateCart productID={product.productID} stock={product.stock} />
            </div>
        </div>
    )
}