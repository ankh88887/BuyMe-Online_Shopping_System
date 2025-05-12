import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import styles from './Payment.module.css';
import { CurrentLoginUser } from './CurrentLoginUser';
import { CartContext } from './CartContext';

const API_BASE_URL = 'http://localhost:5005/api';

const PaymentPage = () => {
    const [personalInfo, setPersonalInfo] = useState({
        userName: '',
        address: '',
        email: '',
    });
    const [cardInfo, setCardInfo] = useState({
        CardOwner: '',
        CDNo: '',
        expiryDate: '',
        CVV: '',
        isEditable: true,
    });
    const [editCardMode, setEditCardMode] = useState(false);
    const [tempCardInfo, setTempCardInfo] = useState({ ...cardInfo });
    const [errors, setErrors] = useState({
        CardOwner: '',
        CDNo: '',
        expiryDate: '',
        CVV: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    
    const location = useLocation();
    const navigate = useNavigate();
    const totalCost = location.state?.totalCost || '1500.00';
    const items = location.state?.items || new Map();
    
    const { currentUser } = useContext(CurrentLoginUser);
    const { cartItems, setCartItems } = useContext(CartContext);
    const userID = currentUser?.userID;

    useEffect(() => {
        console.log('Payment - currentUser:', currentUser);
        console.log('Payment - userID:', userID);

        if (!userID) {
            navigate('/login');
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${userID}`);
                const user = response.data;
                console.log('Payment - Fetched user info:', user);
                setPersonalInfo({
                    userName: user.userName || '',
                    address: user.address || '',
                    email: user.email || '',
                });
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        const fetchPaymentInfo = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/payments/${userID}`);
                const payment = response.data;
                console.log('Payment - Fetched payment info:', payment);
                setCardInfo({
                    CardOwner: payment.CardOwner || '',
                    CDNo: payment.CDNo ? payment.CDNo.toString() : '',
                    expiryDate: payment.expiryDate || '',
                    CVV: payment.CVV ? payment.CVV.toString() : '',
                    isEditable: true,
                });
                setTempCardInfo({
                    CardOwner: payment.CardOwner || '',
                    CDNo: payment.CDNo ? payment.CDNo.toString() : '',
                    expiryDate: payment.expiryDate || '',
                    CVV: payment.CVV ? payment.CVV.toString() : '',
                    isEditable: true,
                });
            } catch (error) {
                console.error('Error fetching payment info:', error);
            }
        };

        fetchUserInfo();
        fetchPaymentInfo();
    }, [userID, navigate]);

    // Format card number as user types (4-digit groups)
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{1,4}/g);
        return matches ? matches.join(' ').substr(0, 19) : '';
    };

    // Format expiry date as MM/YY
    const formatExpiryDate = (value) => {
        const cleanValue = value.replace(/[^\d]/g, '').substring(0, 4);
        if (cleanValue.length > 2) {
            return `${cleanValue.substring(0, 2)}/${cleanValue.substring(2)}`;
        }
        return cleanValue;
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        
        setErrors(prev => ({ ...prev, [name]: '' }));
        
        if (name === 'CDNo') {
            const formattedValue = formatCardNumber(value);
            setTempCardInfo(prev => ({ ...prev, [name]: formattedValue }));
        } else if (name === 'expiryDate') {
            setTempCardInfo(prev => ({ ...prev, [name]: formatExpiryDate(value) }));
        } else if (name === 'CVV') {
            const cvvValue = value.replace(/[^\d]/g, '').substring(0, 4);
            setTempCardInfo(prev => ({ ...prev, [name]: cvvValue }));
        } else {
            setTempCardInfo(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateCardInfo = () => {
        let newErrors = {
            CardOwner: '',
            CDNo: '',
            expiryDate: '',
            CVV: ''
        };
        let hasErrors = false;
        
        if (!tempCardInfo.CardOwner.trim()) {
            newErrors.CardOwner = 'Card holder name is required';
            hasErrors = true;
        }
        
        const cardNumberDigits = tempCardInfo.CDNo.replace(/\s/g, '');
        if (!cardNumberDigits || cardNumberDigits.length < 15 || cardNumberDigits.length > 16) {
            newErrors.CDNo = 'Please enter a valid card number';
            hasErrors = true;
        }
        
        if (!tempCardInfo.expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
            hasErrors = true;
        } else {
            const [month, year] = tempCardInfo.expiryDate.split('/');
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (!month || !year || monthNum < 1 || monthNum > 12) {
                newErrors.expiryDate = 'Please enter a valid month (01-12)';
                hasErrors = true;
            } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
                newErrors.expiryDate = 'Card has expired';
                hasErrors = true;
            }
        }
        
        if (!tempCardInfo.CVV || !/^\d{3,4}$/.test(tempCardInfo.CVV)) {
            newErrors.CVV = 'Please enter a valid security code';
            hasErrors = true;
        }
        
        setErrors(newErrors);
        return !hasErrors;
    };

    const handleSaveCardChanges = async () => {
        if (!validateCardInfo()) {
            return;
        }

        setIsProcessing(true);
        try {
            await axios.put(`${API_BASE_URL}/payments/${userID}`, {
                CDNo: tempCardInfo.CDNo.replace(/\s/g, ''),
                expiryDate: tempCardInfo.expiryDate,
                CVV: tempCardInfo.CVV,
                CardOwner: tempCardInfo.CardOwner,
            });
            setCardInfo({ ...tempCardInfo });
            setEditCardMode(false);
            console.log('Payment - Updated card info:', tempCardInfo);
        } catch (error) {
            console.error('Error updating payment info:', error);
            alert('Failed to update payment information');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelCardEdit = () => {
        setTempCardInfo({ ...cardInfo });
        setEditCardMode(false);
        setErrors({
            CardOwner: '',
            CDNo: '',
            expiryDate: '',
            CVV: ''
        });
    };

    const handleEditCard = () => {
        if (cardInfo.isEditable) {
            setEditCardMode(true);
        }
    };

    const isFormValid = () => {
        const requiredPersonalFields = ['userName', 'email'];
        const requiredCardFields = ['CardOwner', 'CDNo', 'expiryDate', 'CVV'];

        const isPersonalValid = requiredPersonalFields.every(field => {
            const isValid = personalInfo[field] && personalInfo[field].trim() !== '';
            console.log(`Payment - Personal field ${field}: ${personalInfo[field]} (Valid: ${isValid})`);
            return isValid;
        });
        const isCardValid = requiredCardFields.every(field => {
            const isValid = cardInfo[field] && cardInfo[field].trim() !== '';
            console.log(`Payment - Card field ${field}: ${cardInfo[field]} (Valid: ${isValid})`);
            return isValid;
        });

        console.log('Payment - isPersonalValid:', isPersonalValid);
        console.log('Payment - isCardValid:', isCardValid);
        return isPersonalValid && isCardValid;
    };

    const updateProductStock = async (productID, quantity) => {
        try {
            const productResponse = await axios.get(`${API_BASE_URL}/products/${productID}`);
            const product = productResponse.data;
            
            const currentStock = product.stock || 0;
            const newStock = Math.max(0, currentStock - quantity);
            
            console.log(`Updating product ${productID} stock: ${currentStock} -> ${newStock}`);
            
            await axios.put(`${API_BASE_URL}/products/${productID}`, {
                stock: newStock
            });
            
            return true;
        } catch (error) {
            console.error(`Error updating stock for product ${productID}:`, error);
            return false;
        }
    };

    const validateStock = async () => {
        let allInStock = true;
        let outOfStockItems = [];
        
        for (const [productID, quantity] of items.entries()) {
            try {
                const productResponse = await axios.get(`${API_BASE_URL}/products/${productID}`);
                const product = productResponse.data;
                
                if (!product.stock || product.stock < quantity) {
                    allInStock = false;
                    outOfStockItems.push({
                        name: product.productName,
                        requested: quantity,
                        available: product.stock || 0
                    });
                }
            } catch (error) {
                console.error(`Error checking stock for product ${productID}:`, error);
                allInStock = false;
            }
        }
        
        if (!allInStock) {
            let errorMessage = 'Some items are out of stock:\n';
            outOfStockItems.forEach(item => {
                errorMessage += `${item.name}: requested ${item.requested}, only ${item.available} available\n`;
            });
            alert(errorMessage);
        }
        
        return allInStock;
    };

    const handleConfirmPayment = async () => {
        if (!isFormValid()) {
            alert('Please fill in all required fields (username, email, and card details) before confirming payment.');
            return;
        }

        setIsProcessing(true);
        try {
            // First, validate that all items are in stock
            const stockValid = await validateStock();
            if (!stockValid) {
                setIsProcessing(false);
                return; // Stop the payment process if items are out of stock
            }
            
            // Prepare a list of stock update operations
            const stockUpdatePromises = [];
            for (const [productID, quantity] of items.entries()) {
                stockUpdatePromises.push(updateProductStock(productID, quantity));
            }
            
            // Execute all stock updates in parallel
            const stockUpdateResults = await Promise.all(stockUpdatePromises);
            
            // Check if any stock updates failed
            if (stockUpdateResults.includes(false)) {
                console.warn('Some stock updates failed, but continuing with payment');
            }

            // Convert cartItems from CartContext to the format expected by the API
            const cartItemsObject = {};
            cartItems.forEach(item => {
                cartItemsObject[item.id] = item.quantity;
            });

            // Update the existing active cart with the current cartItems
            const currentDate = new Date().toISOString();
            await axios.put(`${API_BASE_URL}/carts/${userID}`, {
                items: cartItemsObject,
                totalCost: parseFloat(totalCost),
                purchaseDate: currentDate,
                isActive: false,
            });

            // Create a new empty active cart
            const newCartID = `cart_${Date.now()}`;
            await axios.post(`${API_BASE_URL}/carts`, {
                CartID: newCartID,
                userID: userID,
                items: {},
                totalCost: 0,
                isActive: true,
            });
            
            // Clear the CartContext to ensure the UI shows an empty cart
            setCartItems([]);

            alert('Payment confirmed successfully!');
            navigate('/history');
        } catch (error) {
            console.error('Error confirming payment:', error);
            alert('Failed to confirm payment');
        } finally {
            setIsProcessing(false);
        }
    };

    const renderError = (errorMessage) => {
        if (!errorMessage) return null;
        return (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errorMessage}
            </div>
        );
    };

    return (
        <div className={styles.paymentBackground}>
            <NavBar />
            <div className={styles.paymentContainer}>
                <div className={styles.paymentHeader}>
                    <h1>Payment Info</h1>
                </div>
                <div className={styles.paymentSection}>
                    <div className={styles.infoGroup}>
                        <h3>Personal Info</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Username *</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={personalInfo.userName}
                                    className={styles.formInput}
                                    readOnly
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="address">Address</label>
                                <input
                                    id="address"
                                    type="text"
                                    value={personalInfo.address}
                                    className={styles.formInput}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        id="email"
                                        type="text"
                                        value={personalInfo.email}
                                        className={styles.formInput}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <button
                                className={styles.btnProfile}
                                onClick={() => navigate('/profile')}
                            >
                                Edit Profile
                            </button>
                        </div>
                        <div className={styles.infoGroup}>
                            <h3>Card Info</h3>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="cardOwner">Card holder's name *</label>
                                    {editCardMode ? (
                                        <>
                                            <input
                                                id="cardOwner"
                                                type="text"
                                                name="CardOwner"
                                                value={tempCardInfo.CardOwner}
                                                onChange={handleCardInputChange}
                                                className={styles.formInput}
                                                placeholder="Enter name"
                                                style={errors.CardOwner ? {borderColor: 'red'} : {}}
                                            />
                                            {renderError(errors.CardOwner)}
                                        </>
                                    ) : (
                                        <input
                                            id="cardOwner"
                                            type="text"
                                            value={cardInfo.CardOwner}
                                            className={styles.formInput}
                                            readOnly
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="cardID">Card Number *</label>
                                    {editCardMode ? (
                                        <>
                                            <input
                                                id="cardID"
                                                type="text"
                                                name="CDNo"
                                                value={tempCardInfo.CDNo}
                                                onChange={handleCardInputChange}
                                                className={styles.formInput}
                                                placeholder="XXXX XXXX XXXX XXXX"
                                                style={errors.CDNo ? {borderColor: 'red'} : {}}
                                            />
                                            {renderError(errors.CDNo)}
                                        </>
                                    ) : (
                                        <input
                                            type="text"
                                            value={cardInfo.CDNo}
                                            className={styles.formInput}
                                            readOnly
                                        />
                                    )}
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="expiryDate">Expiry date (MM/YY) *</label>
                                    <div className={styles.expiryGroup}>
                                        {editCardMode ? (
                                            <>
                                                <input
                                                    id="expiryDate"
                                                    type="text"
                                                    name="expiryDate"
                                                    value={tempCardInfo.expiryDate}
                                                    onChange={handleCardInputChange}
                                                    className={styles.formInput}
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                    style={errors.expiryDate ? {borderColor: 'red'} : {}}
                                                />
                                                {renderError(errors.expiryDate)}
                                            </>
                                        ) : (
                                            <input
                                                type="text"
                                                value={cardInfo.expiryDate}
                                                className={styles.formInput}
                                                readOnly
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="cvv">Security Code (CVV) *</label>
                                    {editCardMode ? (
                                        <>
                                            <input
                                                id="cvv"
                                                type="text"
                                                name="CVV"
                                                value={tempCardInfo.CVV}
                                                onChange={handleCardInputChange}
                                                className={styles.formInput}
                                                placeholder="XXX"
                                                maxLength="4"
                                                style={errors.CVV ? {borderColor: 'red'} : {}}
                                            />
                                            {renderError(errors.CVV)}
                                        </>
                                    ) : (
                                        <input
                                            id="cvv"
                                            type="text"
                                            value={cardInfo.CVV}
                                            className={styles.formInput}
                                            readOnly
                                        />
                                    )}
                                </div>
                            </div>
                            {editCardMode ? (
                                <div className={styles.actionButtons}>
                                    <button 
                                        className={styles.btnCancel} 
                                        onClick={handleCancelCardEdit}
                                        disabled={isProcessing}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className={styles.btnSave} 
                                        onClick={handleSaveCardChanges}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className={styles.btnEdit}
                                    onClick={handleEditCard}
                                    disabled={!cardInfo.isEditable}
                                >
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className={styles.paymentFooter}>
                            <div className={styles.totalRow}>
                                <span>Total cost:</span>
                                <input
                                    type="text"
                                    value={`$${totalCost}`}
                                    className={styles.formInput}
                                    readOnly
                                />
                            </div>
                            <button
                                className={styles.btnConfirm}
                                onClick={handleConfirmPayment}
                                disabled={!isFormValid() || isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default PaymentPage;