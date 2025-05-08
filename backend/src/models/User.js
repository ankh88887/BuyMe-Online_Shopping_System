const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {type: String, required: true, unique: true},
    isAdmin: {type: Boolean, default: false},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    address: {type: String}
});



const User = mongoose.model('User', userSchema);

module.exports = User;