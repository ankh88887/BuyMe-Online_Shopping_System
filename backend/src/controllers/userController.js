const Users = require('../models/User');

function UserConstructor(user) {
  return {
    userID: user.userID,
    isAdmin: user.isAdmin,
    userName: user.userName,
    password: user.password,
    email: user.email,
    address: user.address
  };
}

// @desc    Get all Users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find({});
    if (users) {
      console.log('User found:', users); // Log the found user
      res.json({
        users: users.map((User) => (UserConstructor(User)))
      })
    } else {
      res.status(404).json({ error: 'User not found' }); // Handle not found
    }
  } catch (error) {
    console.error('Error fetching User:', error);
    res.status(500).json({ error: 'Server error' }); // Handle server error
  }
};

// @desc    Get single User by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  const userID = req.params.id; // Get the UserID from the request parameters
  try {
    const user = await Users.findOne({ userID: userID }); // Search for the user by userID
    if (user) {
      const constructedUser = UserConstructor(user); // Transform the user
      console.log('User found:', constructedUser); // Log the transformed User
      res.json(constructedUser); // Return the transformed User
    } else {
      res.status(404).json({ error: 'User not found' }); // Handle not found
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' }); // Handle server error
  }
};

// @desc    Get single User by username
// @route   GET /api/users/search/:userName
exports.getUserByUsername = async (req, res) => {
  const userName = req.params.userName; // Get the UserName from the request parameters
  try {
    const user = await Users.findOne({ userName: userName }); // Search for the user by userID
    if (user) {
      const constructedUser = UserConstructor(user); // Transform the user
      console.log('User found:', constructedUser); // Log the transformed User
      res.json(constructedUser); // Return the transformed User
    } else {
      res.status(404).json({ error: 'User not found' }); // Handle not found
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' }); // Handle server error
  }
};