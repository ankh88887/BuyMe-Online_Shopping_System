import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './NavBar';
import styles from './Payment.module.css';

// Set the base URL for API calls
const API_BASE_URL = 'http://localhost:5005';

const PaymentPage = () => {
    const [personalInfo, setPersonalInfo] = useState({
        userName: '',
        address: '',
        email: '',
        phone: '',
    });
    const [cardInfo, setCardInfo] = useState({
        CardOwner: '',
        CDNo: '',
        expiryDate: '',
        CVV: '',
        isEditable: true,
    });
    const [editPersonalMode, setEditPersonalMode] = useState(false);
    const [editCardMode, setEditCardMode] = useState(false);
    const [tempPersonalInfo, setTempPersonalInfo] = useState({ ...personalInfo });
    const [tempCardInfo, setTempCardInfo] = useState({ ...cardInfo });
    const location = useLocation();
    const navigate = useNavigate();
    const totalCost = location.state?.totalCost || '1500.00';
    const items = location.state?.items || new Map();

    const userID = localStorage.getItem('userID') || 'user123';

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/users/${userID}`);
                const user = response.data;
                setPersonalInfo({
                    userName: user.userName,
                    address: user.address || '',
                    email: user.email,
                    phone: '',
                });
                setTempPersonalInfo({
                    userName: user.userName,
                    address: user.address || '',
                    email: user.email,
                    phone: '',
                });
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        const fetchPaymentInfo = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/payments/${userID}`);
                const payment = response.data;
                setCardInfo({
                    CardOwner: payment.CardOwner,
                    CDNo: payment.CDNo.toString(),
                    expiryDate: payment.expiryDate,
                    CVV: payment.CVV.toString(),
                    isEditable: true,
                });
                setTempCardInfo({
                    CardOwner: payment.CardOwner,
                    CDNo: payment.CDNo.toString(),
                    expiryDate: payment.expiryDate,
                    CVV: payment.CVV.toString(),
                    isEditable: true,
                });
            } catch (error) {
                console.error('Error fetching payment info:', error);
            }
        };

        fetchUserInfo();
        fetchPaymentInfo();
    }, [userID]);

    const handlePersonalInputChange = (e) => {
        const { name, value } = e.target;
        setTempPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setTempCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePersonalChanges = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${userID}`, {
                userName: tempPersonalInfo.userName,
                email: tempPersonalInfo.email,
                address: tempPersonalInfo.address,
                phone: tempPersonalInfo.phone,
            });
            setPersonalInfo({ ...tempPersonalInfo });
            setEditPersonalMode(false);
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('Failed to update personal information');
        }
    };

    const handleCancelPersonalEdit = () => {
        setTempPersonalInfo({ ...personalInfo });
        setEditPersonalMode(false);
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

    const handleConfirmPayment = async () => {
        try {
            const cartID = `cart_${Date.now()}`;
            await axios.post(`${API_BASE_URL}/carts`, {
                CartID: cartID,
                userID: userID,
                items: Object.fromEntries(items),
                totalCost: parseFloat(totalCost),
            });

            // Create a new empty cart to clear the current one
            const newCartID = `cart_${Date.now() + 1}`;
            await axios.post(`${API_BASE_URL}/carts`, {
                CartID: newCartID,
                userID: userID,
                items: {},
                totalCost: 0,
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
                    <h1>(1800 x 820) Payment Info.</h1>
                </div>
                <div className={styles.paymentSection}>
                    <div className={styles.infoGroup}>
                        <h3>Personal Info.</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Username</label>
                                {editPersonalMode ? (
                                    <input
                                        type="text"
                                        name="userName"
                                        value={tempPersonalInfo.userName}
                                        onChange={handlePersonalInputChange}
                                        className={styles.formInput}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={personalInfo.userName}
                                        className={styles.formInput}
                                        readOnly
                                    />
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Address</label>
                                {editPersonalMode ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={tempPersonalInfo.address}
                                        onChange={handlePersonalInputChange}
                                        className={styles.formInput}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={personalInfo.address}
                                        className={styles.formInput}
                                        readOnly
                                    />
                                )}
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                {editPersonalMode ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={tempPersonalInfo.email}
                                        onChange={handlePersonalInputChange}
                                        className={styles.formInput}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={personalInfo.email}
                                        className={styles.formInput}
                                        readOnly
                                    />
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone number</label>
                                {editPersonalMode ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={tempPersonalInfo.phone}
                                        onChange={handlePersonalInputChange}
                                        className={styles.formInput}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={personalInfo.phone}
                                        className={styles.formInput}
                                        readOnly
                                    />
                                )}
                            </div>
                        </div>
                        {editPersonalMode ? (
                            <div className={styles.actionButtons}>
                                <button className={styles.btnCancel} onClick={handleCancelPersonalEdit}>Cancel</button>
                                <button className={styles.btnSave} onClick={handleSavePersonalChanges}>Save</button>
                            </div>
                        ) : (
                            <button className={styles.btnEdit} onClick={() => setEditPersonalMode(true)}>Edit</button>
                        )}
                    </div>
                    <div className={styles.infoGroup}>
                        <h3>Card Info.</h3>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Card holder's name</label>
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
                                <label>Card ID</label>
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
                                <label>Expiry date</label>
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
                                <label>CVV</label>
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
                        <button className={styles.btnConfirm} onClick={handleConfirmPayment}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;