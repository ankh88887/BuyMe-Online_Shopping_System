import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import styles from './Payment.module.css';

const PaymentPage = () => {
    //demo
    const [personalInfo, setPersonalInfo] = useState({
        username: 'JohnDoe',
        address: '123 Main St, City, Country',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
    });
    const [cardInfo, setCardInfo] = useState({
        cardHolderName: 'John Doe',
        cardId: '3872 2378 2331 4242',
        expiryMonth: '11',
        expiryYear: '11',
        cvv: '888',
        isEditable: true, 
    });
    const [editPersonalMode, setEditPersonalMode] = useState(false);
    const [editCardMode, setEditCardMode] = useState(false);
    const [tempPersonalInfo, setTempPersonalInfo] = useState({ ...personalInfo });
    const [tempCardInfo, setTempCardInfo] = useState({ ...cardInfo });
    const location = useLocation();
    const totalCost = location.state?.totalCost || '1500.00'; 

    useEffect(() => {
        // Simulate fetch data
        setTempPersonalInfo({ ...personalInfo });
        setTempCardInfo({ ...cardInfo });
    }, []);

    const handlePersonalInputChange = (e) => {
        const { name, value } = e.target;
        setTempPersonalInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setTempCardInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePersonalChanges = () => {
        setPersonalInfo({ ...tempPersonalInfo });
        setEditPersonalMode(false);
    };

    const handleCancelPersonalEdit = () => {
        setTempPersonalInfo({ ...personalInfo });
        setEditPersonalMode(false);
    };

    const handleSaveCardChanges = () => {
        // Validation
        if (!tempCardInfo.cardHolderName) {
            alert('Card holder name is required');
            return;
        }
        if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(tempCardInfo.cardId)) {
            alert('Card ID must be 16 digits in the format XXXX XXXX XXXX XXXX');
            return;
        }
        const month = parseInt(tempCardInfo.expiryMonth, 10);
        const year = parseInt(tempCardInfo.expiryYear, 10);
        if (!tempCardInfo.expiryMonth || !tempCardInfo.expiryYear || month < 1 || month > 12 || year < 0 || year > 99) {
            alert('Expiry date must be valid (MM/YY, month 01-12, year 00-99)');
            return;
        }
        if (!tempCardInfo.cvv || !/^\d{3,4}$/.test(tempCardInfo.cvv)) {
            alert('CVV must be 3 or 4 digits');
            return;
        }

        
        const formattedMonth = tempCardInfo.expiryMonth.padStart(2, '0');
        const formattedYear = tempCardInfo.expiryYear.padStart(2, '0');
        setCardInfo({ ...tempCardInfo, expiryMonth: formattedMonth, expiryYear: formattedYear });
        setEditCardMode(false);
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

    const handleConfirmPayment = () => {
        //demo
        console.log('Payment confirmed with:', { personalInfo, cardInfo, totalCost });
        
    };

    return (
        <div className={styles.paymentBackground}>
            <NavBar />
            <div className={styles.paymentContainer}>
                <div className={styles.paymentHeader}>
                    <h1> Payment Info.</h1>
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
                                        name="username"
                                        value={tempPersonalInfo.username}
                                        onChange={handlePersonalInputChange}
                                        className={styles.formInput}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={personalInfo.username}
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
                                        name="cardHolderName"
                                        value={tempCardInfo.cardHolderName}
                                        onChange={handleCardInputChange}
                                        className={styles.formInput}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={cardInfo.cardHolderName}
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
                                        name="cardId"
                                        value={tempCardInfo.cardId}
                                        onChange={handleCardInputChange}
                                        className={styles.formInput}
                                        placeholder="XXXX XXXX XXXX XXXX"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={cardInfo.cardId}
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
                                        <>
                                            <input
                                                type="text"
                                                name="expiryMonth"
                                                value={tempCardInfo.expiryMonth}
                                                onChange={handleCardInputChange}
                                                className={styles.formInputSmall}
                                                placeholder="MM"
                                                maxLength="2"
                                            />
                                            <span>/</span>
                                            <input
                                                type="text"
                                                name="expiryYear"
                                                value={tempCardInfo.expiryYear}
                                                onChange={handleCardInputChange}
                                                className={styles.formInputSmall}
                                                placeholder="YY"
                                                maxLength="2"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <input
                                                type="text"
                                                value={cardInfo.expiryMonth}
                                                className={styles.formInputSmall}
                                                readOnly
                                            />
                                            <span>/</span>
                                            <input
                                                type="text"
                                                value={cardInfo.expiryYear}
                                                className={styles.formInputSmall}
                                                readOnly
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>CVV</label>
                                {editCardMode ? (
                                    <input
                                        type="text"
                                        name="cvv"
                                        value={tempCardInfo.cvv}
                                        onChange={handleCardInputChange}
                                        className={styles.formInput}
                                        placeholder="CVV"
                                        maxLength="4"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={cardInfo.cvv}
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