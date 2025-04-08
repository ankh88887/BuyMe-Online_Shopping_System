import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './SearchProductCell.module.css';

export default function SearchProductCell({ productJSON }) {
    const [product, setProduct] = useState(null)
    useEffect(() => {
        setProduct(productJSON);
    }, [productJSON])

    if (!product) {
        return <p>Loading...</p> // Show loading message while fetching
    }
    return (
        <div className={styles.productCell}>
            <Link to={'/product/' + product.id}>
                <img src={process.env.PUBLIC_URL + '/Images/' + product.image} alt={product.name} className={styles.image} />
            </Link>
            <div className={styles.productDetailContainer}>
                <h2 className={styles.productName}>{product.name}</h2>
                <p className={styles.productPrice}>${product.price}</p>
            </div>
        </div>
    )
}