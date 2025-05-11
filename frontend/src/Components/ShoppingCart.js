import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../Components/NavBar';
import styles from './ShoppingCart.module.css';
import { CurrentLoginUser } from '../Components/CurrentLoginUser';
import { CartContext } from '../Components/CartContext';

const API_BASE_URL = 'http://localhost:5005/api';

const ShoppingCart = () => {
    const [cartWithDetails, setCartWithDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentLoginUser);
    // Use CartContext instead of making API calls for cart updates
    const { cartItems, setCartItems } = useContext(CartContext);
    
    const userID = currentUser?.userID;

    // Fetch product details for cart items when cartItems changes
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!userID) {
                navigate('/login');
                return;
            }
            
            setLoading(true);
            try {
                const itemsWithDetails = [];
                
                // Fetch details for each product in the cart
                for (const item of cartItems) {
                    try {
                        const productResponse = await axios.get(`${API_BASE_URL}/products/${item.id}`);
                        const product = productResponse.data;
                        
                        itemsWithDetails.push({
                            id: item.id,
                            name: product.productName,
                            quantity: item.quantity,
                            cost: product.price,
                        });
                    } catch (error) {
                        console.error(`Error fetching product ${item.id}:`, error);
                    }
                }
                
                setCartWithDetails(itemsWithDetails);
            } catch (error) {
                console.error('Error preparing cart:', error);
            } finally {
                setLoading(false);
            }
        };

        if (cartItems.length > 0) {
            fetchProductDetails();
        } else {
            setCartWithDetails([]);
            setLoading(false);
        }
    }, [cartItems, userID, navigate]);

    // Load initial cart data when component mounts or when navigated to
    useEffect(() => {
        const loadInitialCart = async () => {
            if (!userID) {
                navigate('/login');
                return;
            }
            
            setLoading(true);
            try {
                const cartResponse = await axios.get(`${API_BASE_URL}/carts/active/${userID}`);
                const cart = cartResponse.data;
                
                if (cart && cart.items) {
                    // Convert object format to array format expected by UpdateCartBtn
                    const cartItemsArray = [];
                    for (const [productID, quantity] of Object.entries(cart.items)) {
                        cartItemsArray.push({
                            id: productID,
                            quantity: parseInt(quantity, 10)
                        });
                    }
                    
                    // Always update cart items from the database, regardless of current state
                    setCartItems(cartItemsArray);
                } else {
                    // If no active cart or empty items, ensure the cart is empty
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Error loading initial cart:', error);
                // If there's an error, still clear the cart to prevent stale data
                setCartItems([]);
            } finally {
                setLoading(false);
            }
        };
        
        // Always load the cart when component mounts or when focusing the page
        loadInitialCart();

        // Add an event listener to reload cart data when the page gets focus
        // This ensures cart is refreshed when navigating back to it after payment
        const handleFocus = () => {
            loadInitialCart();
        };
        
        window.addEventListener('focus', handleFocus);
        
        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
        
    }, [userID, navigate, setCartItems]); // Removed cartItems.length dependency

    const handleQuantityChange = (id, delta) => {
        setCartItems(prevItems => {
            const itemIndex = prevItems.findIndex(item => item.id === id);
            if (itemIndex === -1) return prevItems;
            
            const updatedItems = [...prevItems];
            const newQuantity = updatedItems[itemIndex].quantity + delta;
            
            if (newQuantity <= 0) {
                // Remove item if quantity becomes zero or negative
                updatedItems.splice(itemIndex, 1);
            } else {
                // Update quantity
                updatedItems[itemIndex] = {
                    ...updatedItems[itemIndex],
                    quantity: newQuantity
                };
            }
            
            return updatedItems;
        });
    };

    // Function to synchronize cart with backend after quantity changes
    const syncCartWithBackend = async () => {
        if (!userID) return;
        
        try {
            // Convert cart items to the format expected by the API
            const cartItemsObject = {};
            cartItems.forEach(item => {
                cartItemsObject[item.id] = item.quantity;
            });
            
            // Update the active cart in the database
            await axios.put(`${API_BASE_URL}/carts/${userID}`, {
                items: cartItemsObject,
                totalCost: parseFloat(calculateTotal()),
                isActive: true
            });
            
            console.log('Cart synchronized with backend');
        } catch (error) {
            console.error('Error synchronizing cart with backend:', error);
        }
    };

    // Sync cart with backend whenever cart items change
    useEffect(() => {
        if (cartItems.length > 0) {
            syncCartWithBackend();
        }
    }, [cartItems]); // eslint-disable-line react-hooks/exhaustive-deps

    const calculateTotal = () => {
        return cartWithDetails.reduce((sum, item) => sum + item.quantity * item.cost, 0).toFixed(2);
    };

    const calculateTotalQuantity = () => {
        return cartWithDetails.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handleMakePayment = () => {
        const totalCost = calculateTotal();
        const itemsMap = new Map(cartWithDetails.map(item => [item.id, item.quantity]));
        navigate('/payment', { state: { totalCost, items: itemsMap } });
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.cartBackground}>
            <NavBar />
            <div className={styles.cartContainer}>
                <div className={styles.cartHeader}>
                    <h1>Shopping Cart List</h1>
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
                            {cartWithDetails.length === 0 ? (
                                <tr>
                                    <td colSpan="3">Your cart is empty</td>
                                </tr>
                            ) : (
                                cartWithDetails.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <button
                                                    className={styles.BtnAble}
                                                    onClick={() => handleQuantityChange(item.id, -1)}
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
                        <button className={styles.payButton} onClick={handleMakePayment} disabled={cartWithDetails.length === 0}>
                            Make Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;