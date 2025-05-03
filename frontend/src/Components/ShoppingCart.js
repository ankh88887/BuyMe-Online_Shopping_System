import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import styles from './ShoppingCart.module.css';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Demo
    const demoData = [
        { id: '1', name: 'Laptop', quantity: 1, cost: 999.99 },
        { id: '2', name: 'Mouse', quantity: 2, cost: 29.99 },
        { id: '3', name: 'Keyboard', quantity: 1, cost: 59.99 },
    ];

    useEffect(() => {
        // Demo
        setCartItems(demoData);
        setLoading(false);
    }, []);

    const handleQuantityChange = (id, delta) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleQuantityInput = (id, value) => {
        const newQuantity = parseInt(value, 10);
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
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
        navigate('/payment', { state: { totalCost } });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.cartBackground}>
            <NavBar />
            <div className={styles.cartContainer}>
                <div className={styles.cartHeader}>
                    <h1>(1770 x 860) shopping cart list</h1>
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
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>
                                        <button
                                            className={styles.quantityButton}
                                            onClick={() => handleQuantityChange(item.id, -1)}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                                            className={styles.quantityInput}
                                            min="1"
                                        />
                                        <button
                                            className={styles.quantityButton}
                                            onClick={() => handleQuantityChange(item.id, 1)}
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td>${(item.cost * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
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
                        <button className={styles.payButton} onClick={handleMakePayment}>Make Payment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;