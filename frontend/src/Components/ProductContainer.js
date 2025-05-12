import { useEffect, useState } from 'react'
import AddToCart from './UpdateCartBtn'
import styles from './ProductContainer.module.css';

export default function ProductContainer({ productJSON }) {
    const [product, setProduct] = useState(null)
    useEffect(() => {
        setProduct(productJSON);
    }, [productJSON])

    if (!product) {
        return <p>Loading...</p>
    }

    return (
        <div className={styles.productContainer}>
            <p className={styles.productName}>{product.productName}</p>
            <div className={styles.productDetails}>
                <img src={process.env.PUBLIC_URL + '/Images/' + product.productImageDir} alt={product.productName} />
                <table className={styles.productTable}>
                    <tbody>
                        <tr height="70px">
                            <td width="200px">Price:</td>
                            <td >${product.price}</td>
                        </tr>
                        <tr height="70px">
                            <td>Stock:</td>
                            <td>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <span>{product.stock === 0? "out of stock" : product.stock}</span>
                                    <AddToCart productID={product.productID} stock={product.stock} />
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