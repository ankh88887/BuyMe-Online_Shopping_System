const Payment = require('../models/Payment');

exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ userID: req.params.id });
        if (!payment) return res.status(404).send('Payment not found');
        res.send(payment);
    } catch (error) {
        console.error('Error fetching payment:', error);
        res.status(500).send('Server error');
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const { CDNo, expiryDate, CVV, CardOwner } = req.body;
        const payment = await Payment.findOneAndUpdate(
            { userID: req.params.id },
            { CDNo, expiryDate, CVV, CardOwner },
            { new: true, upsert: true }
        );
        res.send(payment);
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).send('Server error');
    }
};