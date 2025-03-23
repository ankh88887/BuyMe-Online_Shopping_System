const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userID: {type: String, required: true, unique: true},
    isAdmin: {type: Boolean, default: false},
    userName: {type: String, requird: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    address: {type: String}
});

userSchema.methods.getUserID = function () {
    return this.userID;
};
  
userSchema.methods.getAdmin = function () {
    return this.isAdmin;
};
  
userSchema.methods.getUsername = function () {
    return this.username;
};
  
userSchema.methods.setUsername = function (newUsername) {
    this.username = newUsername;
};
  
userSchema.methods.getPassword = function () {
    return this.password;
};
  
userSchema.methods.setPassword = function (newPassword) {
    this.password = newPassword;
};
  
userSchema.methods.getEmail = function () {
    return this.email;
};
  
userSchema.methods.setEmail = function (newEmail) {
    this.email = newEmail;
};
  
userSchema.methods.getAddress = function () {
    return this.address;
};
  
userSchema.methods.setAddress = function (newAddress) {
    this.address = newAddress;
};

const User = mongoose.model('User', userSchema);

module.exports = User;