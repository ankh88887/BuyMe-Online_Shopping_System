const crypto = require('crypto');
const Payment = require('../models/Payment');


const ENCRYPTION_KEY = Buffer.from('1234567890123456', 'utf8'); // Exactly 16 bytes
const IV = Buffer.from('1234567890abcdef', 'utf8'); // Exactly 16 bytes

if (ENCRYPTION_KEY.length !== 16) {
    throw new Error('ENCRYPTION_KEY must be 16 bytes for AES-128');
}
if (IV.length !== 16) {
    throw new Error('IV must be 16 bytes for AES-128');
}

const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-128-cbc', ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

const decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv('aes-128-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ userID: req.params.id });
        if (!payment) return res.status(404).send('Payment not found');

        const decryptedPayment = {
            userID: payment.userID,
            CDNo: decrypt(payment.CDNo),
            expiryDate: payment.expiryDate,
            CVV: decrypt(payment.CVV),
            CardOwner: decrypt(payment.CardOwner)
        };

        res.send(decryptedPayment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).send('Server error');
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const { CDNo, expiryDate, CVV, CardOwner } = req.body;

        if (!CDNo || !expiryDate || !CVV || !CardOwner) {
            return res.status(400).send('All fields are required');
        }

        const encryptedPayment = {
            CDNo: encrypt(CDNo.toString()),
            expiryDate, // Not encrypted for simplicity
            CVV: encrypt(CVV.toString()),
            CardOwner: encrypt(CardOwner)
        };

        const payment = await Payment.findOneAndUpdate(
            { userID: req.params.id },
            encryptedPayment,
            { new: true, upsert: true }
        );

        const decryptedPayment = {
            userID: payment.userID,
            CDNo: decrypt(payment.CDNo),
            expiryDate: payment.expiryDate,
            CVV: decrypt(payment.CVV),
            CardOwner: decrypt(payment.CardOwner)
        };

        res.send(decryptedPayment);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).send('Server error');
    }
};