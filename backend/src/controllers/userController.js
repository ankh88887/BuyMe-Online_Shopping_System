const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        const { userID, userName, password, email } = req.body;
        const user = new User({ userID, userName, password, email });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Server error');
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ userID: req.params.id });
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userName, email, address, phone } = req.body;
        const user = await User.findOneAndUpdate(
            { userID: req.params.id },
            { userName, email, address, phone },
            { new: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.send(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error');
    }
};