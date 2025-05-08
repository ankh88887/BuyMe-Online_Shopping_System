import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import styles from './Payment.module.css';
import { CurrentLoginUser } from './CurrentLoginUser';

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
    const location = useLocation();
    const navigate = useNavigate();
    const totalCost = location.state?.totalCost || '1500.00';
    const items = location.state?.items || new Map();
    
    const { currentUser } = useContext(CurrentLoginUser);
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

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setTempCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveCardChanges = async () => {
        if (!tempCardInfo.CardOwner) {
            alert('Card holder name is required');
            return;
        }
        if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(tempCardInfo.CDNo)) {
            alert('Card ID must be 16 digits in the format XXXX XXXX XXXX XXXX');
            return;
        }
        const [month, year] = tempCardInfo.expiryDate.split('/');
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        if (!month || !year || monthNum < 1 || monthNum > 12 || yearNum < 0 || yearNum > 99) {
            alert('Expiry date must be valid (MM/YY, month 01-12, year 00-99)');
            return;
        }
        if (!tempCardInfo.CVV || !/^\d{3,4}$/.test(tempCardInfo.CVV)) {
            alert('CVV must be 3 or 4 digits');
            return;
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/payments/${userID}`, {
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
        }
    };

    const handleCancelCardEdit = () => {
        setTempCardInfo({ ...cardInfo });
        setEditCardMode(false);
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

    const handleConfirmPayment = async () => {
        if (!isFormValid()) {
            alert('Please fill in all required fields (username, email, and card details) before confirming payment.');
            return;
        }

        try {
            // Update the existing active cart
            const currentDate = new Date().toISOString();
            await axios.put(`${API_BASE_URL}/carts/${userID}`, {
                items: Object.fromEntries(items),
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

            alert('Payment confirmed successfully!');
            navigate('/history');
        } catch (error) {
            console.error('Error confirming payment:', error);
            alert('Failed to confirm payment');
        }
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
                                <label>Username *</label>
                                <input
                                    type="text"
                                    value={personalInfo.userName}
                                    className={styles.formInput}
                                    readOnly
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={personalInfo.address}
                                    className={styles.formInput}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Email *</label>
                                <input
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
                                <label>Card holder's name *</label>
                                {editCardMode ? (
                                    <input
                                        type="text"
                                        name="CardOwner"
                                        value={tempCardInfo.CardOwner}
                                        onChange={handleCardInputChange}
                                        className={styles.formInput}
                                    />
                                ) : (
                                    <input
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
                                <label>Card ID *</label>
                                {editCardMode ? (
                                    <input
                                        type="text"
                                        name="CDNo"
                                        value={tempCardInfo.CDNo}
                                        onChange={handleCardInputChange}
                                        className={styles.formInput}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                    />
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
                                <label>Expiry date *</label>
                                <div className={styles.expiryGroup}>
                                    {editCardMode ? (
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={tempCardInfo.expiryDate}
                                            onChange={handleCardInputChange}
                                            className={styles.formInput}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
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
                                <label>CVV *</label>
                                {editCardMode ? (
                                    <input
                                        type="text"
                                        name="CVV"
                                        value={tempCardInfo.CVV}
                                        onChange={handleCardInputChange}
                                        className={styles.formInput}
                                        placeholder="CVV"
                                        maxLength="4"
                                    />
                                ) : (
                                    <input
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
                                <button className={styles.btnCancel} onClick={handleCancelCardEdit}>Cancel</button>
                                <button className={styles.btnSave} onClick={handleSaveCardChanges}>Save</button>
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
                            disabled={!isFormValid()}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;