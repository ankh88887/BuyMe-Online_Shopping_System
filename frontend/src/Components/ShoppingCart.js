import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import styles from './ShoppingCart.module.css';

const API_BASE_URL = 'http://localhost:5005';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userID = localStorage.getItem('userID') || 'user123';

    const fetchCartAndProducts = async () => {
        setLoading(true);
        try {
            const cartResponse = await axios.get(`${API_BASE_URL}/carts/active/${userID}`);
            const cart = cartResponse.data;
            const itemsMap = new Map(Object.entries(cart.items || {}));

            const itemsWithDetails = [];
            for (const [productID, quantity] of itemsMap) {
                try {
                    const productResponse = await axios.get(`${API_BASE_URL}/products/${productID}`);
                    const product = productResponse.data;
                    itemsWithDetails.push({
                        id: productID,
                        name: product.productName,
                        quantity: quantity,
                        cost: product.price,
                    });
                } catch (error) {
                    console.error(`Error fetching product ${productID}:`, error);
                }
            }

            setCartItems(itemsWithDetails);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartAndProducts();
    }, [userID]);

    const handleQuantityChange = async (id, delta) => {
        let newItems;
        if (delta < 0 && cartItems.find(item => item.id === id).quantity === 1) {
            // Remove item if quantity would go below 1
            newItems = cartItems.filter(item => item.id !== id);
        } else {
            newItems = cartItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            );
        }
        setCartItems(newItems);

        const itemsMap = newItems.reduce((map, item) => {
            map[item.id] = item.quantity;
            return map;
        }, {});
        try {
            await axios.put(`${API_BASE_URL}/carts/${userID}`, { items: itemsMap });
        } catch (error) {
            console.error('Error updating cart:', error);
            fetchCartAndProducts();
        }
    };

    const handleQuantityInput = async (id, value) => {
        const newQuantity = parseInt(value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            const newItems = cartItems.map(item =>
                item.id === id
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            setCartItems(newItems);

            const itemsMap = newItems.reduce((map, item) => {
                map[item.id] = item.quantity;
                return map;
            }, {});
            try {
                await axios.put(`${API_BASE_URL}/carts/${userID}`, { items: itemsMap });
            } catch (error) {
                console.error('Error updating cart:', error);
                fetchCartAndProducts();
            }
        } else if (newQuantity === 0) {
            const newItems = cartItems.filter(item => item.id !== id);
            setCartItems(newItems);

            const itemsMap = newItems.reduce((map, item) => {
                map[item.id] = item.quantity;
                return map;
            }, {});
            try {
                await axios.put(`${API_BASE_URL}/carts/${userID}`, { items: itemsMap });
            } catch (error) {
                console.error('Error updating cart:', error);
                fetchCartAndProducts();
            }
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity * item.cost, 0).toFixed(2);
    };

    const calculateTotalQuantity = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handleMakePayment = () => {
        const totalCost = calculateTotal();
        const itemsMap = new Map(cartItems.map(item => [item.id, item.quantity]));
        navigate('/payment', { state: { totalCost, items: itemsMap } });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.cartBackground}>
            <NavBar />
            <div className={styles.cartContainer}>
                <div className={styles.cartHeader}>
                    <h1> shopping cart list</h1>
                </div>
                <div className={styles.cartSection}>
                    <table>
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.length === 0 ? (
                                <tr>
                                    <td colSpan="3">Your cart is empty</td>
                                </tr>
                            ) : (
                                cartItems.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <button
                                                    className={item.quantity === 1 ? styles.BtnDisable : styles.BtnAble}
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    disabled={item.quantity === 1}
                                                >
                                                    ⊖
                                                </button>
                                                <span className={styles.Qty}>{item.quantity}</span>
                                                <button
                                                    className={styles.BtnAble}
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                >
                                                    ⊕
                                                </button>
                                            </div>
                                        </td>
                                        <td>${(item.cost * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className={styles.cartFooter}>
                        <div className={styles.totalRow}>
                            <span>Total quantity:</span>
                            <input
                                type="text"
                                value={calculateTotalQuantity()}
                                className={styles.totalInput}
                                readOnly
                            />
                        </div>
                        <div className={styles.totalRow}>
                            <span>Total cost:</span>
                            <input
                                type="text"
                                value={`$${calculateTotal()}`}
                                className={styles.totalInput}
                                readOnly
                            />
                        </div>
                        <button className={styles.payButton} onClick={handleMakePayment} disabled={cartItems.length === 0}>
                            Make Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;