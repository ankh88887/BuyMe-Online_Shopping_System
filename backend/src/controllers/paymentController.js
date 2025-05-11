const Payment = require('../models/Payment');

exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ userID: req.params.id });
        if (!payment) return res.status(404).send('Payment not found');

        res.send({
            userID: payment.userID,
            CDNo: payment.CDNo,
            expiryDate: payment.expiryDate,
            CVV: payment.CVV,
            CardOwner: payment.CardOwner
        });
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

        const paymentData = {
            CDNo,
            expiryDate,
            CVV,
            CardOwner
        };

        const payment = await Payment.findOneAndUpdate(
            { userID: req.params.id },
            paymentData,
            { new: true, upsert: true }
        );

        res.send({
            userID: payment.userID,
            CDNo: payment.CDNo,
            expiryDate: payment.expiryDate,
            CVV: payment.CVV,
            CardOwner: payment.CardOwner
        });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).send('Server error');
    }
};