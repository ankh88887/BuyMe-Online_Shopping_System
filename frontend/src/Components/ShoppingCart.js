import { useState, useEffect, useContext } from 'react';
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
    const [productCache, setProductCache] = useState({});
    const navigate = useNavigate();
    const { currentUser } = useContext(CurrentLoginUser);
    const { cartItems, setCartItems } = useContext(CartContext);
    
    const userID = currentUser?.userID;

    // Fetch product details only for new or uncached products
    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!userID) {
                navigate('/login');
                return;
            }

            setLoading(true);
            try {
                const newCache = { ...productCache };
                const itemsWithDetails = [];

                for (const item of cartItems) {
                    if (!newCache[item.id]) {
                        try {
                            const productResponse = await axios.get(`${API_BASE_URL}/products/${item.id}`);
                            const product = productResponse.data;
                            newCache[item.id] = {
                                name: product.productName,
                                cost: product.price,
                                stock: product.stock,
                            };
                        } catch (error) {
                            console.error(`Error fetching product ${item.id}:`, error);
                            newCache[item.id] = {
                                name: `Product ${item.id} (Not Found)`,
                                cost: 0,
                            };
                        }
                    }

                    itemsWithDetails.push({
                        id: item.id,
                        name: newCache[item.id].name,
                        quantity: item.quantity,
                        cost: newCache[item.id].cost,
                        stock: newCache[item.id].stock,
                    });
                }

                setProductCache(newCache);
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
    }, [cartItems, userID, navigate]); // Keep dependency on cartItems for initial load or new items

    // Load initial cart data from backend
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
                    const backendCartItems = Object.entries(cart.items).map(([productID, quantity]) => ({
                        id: productID,
                        quantity: parseInt(quantity, 10),
                    }));

                    // Merge backend cart with current cartItems
                    setCartItems(prevItems => {
                        const mergedItems = [...prevItems];
                        backendCartItems.forEach(backendItem => {
                            const existingItemIndex = mergedItems.findIndex(item => item.id === backendItem.id);
                            if (existingItemIndex === -1) {
                                mergedItems.push(backendItem);
                            }
                        });
                        return mergedItems;
                    });
                }
            } catch (error) {
                console.error('Error loading initial cart:', error);
            } finally {
                setLoading(false);
            }
        };

        loadInitialCart();

        const handleFocus = () => {
            loadInitialCart();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [userID, navigate, setCartItems]);

    const handleQuantityChange = (id, delta) => {
        setCartItems(prevItems => {
            const itemIndex = prevItems.findIndex(item => item.id === id);
            if (itemIndex === -1) return prevItems;

            const updatedItems = [...prevItems];
            const newQuantity = updatedItems[itemIndex].quantity + delta;

            if (newQuantity <= 0) {
                updatedItems.splice(itemIndex, 1);
            } else {
                updatedItems[itemIndex] = {
                    ...updatedItems[itemIndex],
                    quantity: newQuantity,
                };
            }

            // Update cartWithDetails directly to avoid re-fetch
            setCartWithDetails(prevDetails => {
                const updatedDetails = prevDetails.map(detail =>
                    detail.id === id
                        ? { ...detail, quantity: newQuantity }
                        : detail
                );
                return newQuantity <= 0
                    ? updatedDetails.filter(detail => detail.id !== id)
                    : updatedDetails;
            });

            return updatedItems;
        });
    };

    const calculateTotal = () => {
        return cartWithDetails
            .reduce((sum, item) => sum + item.quantity * item.cost, 0)
            .toFixed(2);
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
                                                    className={item.quantity >= item.stock ? styles.AddBtndisabled : styles.BtnAble}
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    disabled={item.quantity >= item.stock}
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
                        <button
                            className={styles.payButton}
                            onClick={handleMakePayment}
                            disabled={cartWithDetails.length === 0}
                        >
                            Make Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;