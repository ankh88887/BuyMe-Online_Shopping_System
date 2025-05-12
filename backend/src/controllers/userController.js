const User = require('../models/User')
const bcrypt = require('bcryptjs')


function UserConstructor(user) {
  return {
    userID: user.userID,
    isAdmin: user.isAdmin,
    userName: user.userName,
    password: user.password,
    email: user.email,
    address: user.address
  }
}


// @desc    Get single User by username
// @route   GET /api/users/search/:userName
exports.getUserByUsername = async (req, res) => {
  const userName = req.params.userName // Get the UserName from the request parameters
  try {
    const user = await User.findOne({ userName: userName }) // Search for the user by userID
    console.log('Searching for user with:', userName) // Log the search
    console.log('User found:', user) // Log the found user
    if (user) {
      const constructedUser = UserConstructor(user) // Transform the user
      console.log('User found:', constructedUser) // Log the transformed User
      res.json(constructedUser) // Return the transformed User
    } else {
      res.status(404).json({ error: 'User not found' }) // Handle not found
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Server error' }) // Handle server error
  }
}



// @desc    Let users to Login
// @route   GET /api/Users/login

exports.LoginUser = async (req, res) => {
  const { userNameOrEmail, password } = req.body

  if (!userNameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' })
  }

  try {
    const user = await User.findOne({
      $or: [
        { userName: { $regex: userNameOrEmail, $options: 'i' } }, // Case-insensitive search for username
        { email: { $regex: userNameOrEmail, $options: 'i' } }    // Case-insensitive search for email
      ]
    })

    if (!user) {
      console.log('User not found')
      return res.status(401).json({ error: 'Invalid username/email' })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (isPasswordMatch) {
      console.log('User logged in:', userNameOrEmail)
      res.json(UserConstructor(user))
    }
    else {
      console.log('entered password:', password)
      console.log('User password:', user.password)
      return res.status(401).json({ error: 'Invalid password' })
    }

  } catch (error) {
    console.error('Error logging in user:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

// @desc    First time register a user (default is not admin)
// @route   GET /api/Users/register

exports.RegisterUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ // At least 8 characters, with letters and numbers
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain both letters and numbers.' })
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ userName: username }, { email: email }],
    })
    console.log('Existing user:', existingUser) // Log the search
    if (existingUser) {
      if (existingUser.userName === username) {
        return res.status(400).json({ message: 'Username is already taken' })
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email is already registered' })
      }
    }

    // Generate userID based on the latest user in the database
    const latestUser = await User.findOne().sort({ userID: -1 }) // Find the user with the highest userID
    const userID = latestUser ? parseInt(latestUser.userID) + 1 : 1 // If no users exist, start with userID = 1

    // Create a new user
    const newUser = new User({
      userID: userID,
      isAdmin: false, // Default to false
      userName: username,
      password: await bcrypt.hash(password, 10), // Hash the password before saving
      email: email,
      address: "",
    })

    console.log(username, email, password, confirmPassword) // Log the input values for debugging
    // Check if the user exists in the database

    await newUser.save()

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userID: newUser.userID,
        userName: newUser.username,
        email: newUser.email,
        password: newUser.password,
        isAdmin: newUser.isAdmin,
      },
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    change passoword requested by user
// @route   GET /api/Users/forget-password/

exports.ForgetPassword = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body

    // Check if all required fields are provided
    if (!userName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ // At least 8 characters, with letters and numbers
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain both letters and numbers.' })
    }

    console.log(userName, email, password, confirmPassword) // Log the input values for debugging
    // Check if the user exists in the database
    // Find the user by username and email
    const user = await User.findOne({ userName, email })

    if (!user) {
      return res.status(404).json({ message: 'Username and Email do not match' })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password in the database
    user.password = hashedPassword
    await user.save()

    // Notify the user and redirect them to the login page
    res.status(200).json({ message: 'Password updated successfully. Please log in with your new password.' })
  } catch (error) {
    console.error('Error in ForgetPassword:', error)
    res.status(500).json({ message: 'Server Error' })
  }
}

// @desc    Get single User by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  const userID = req.params.id; // Get the UserID from the request parameters
  try {
    const user = await User.findOne({ userID: userID }); // Search for the user by userID
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
};// @desc    Get all Users
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res) => {
  try {
    const User = await Users.find({})
    if (User) {
      console.log('User found:', User) // Log the found user
      res.json({
        users: User.map((User) => (UserConstructor(User)))
      })
    } else {
      res.status(404).json({ error: 'User not found' }) // Handle not found
    }
  } catch (error) {
    console.error('Error fetching User:', error)
    res.status(500).json({ error: 'Server error' }) // Handle server error
  }
}

// @desc    Get single User by ID
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  const userID = req.params.id // Get the UserID from the request parameters
  try {
    const user = await User.findOne({ userID: userID }) // Search for the user by userID
    if (user) {
      const constructedUser = UserConstructor(user) // Transform the user
      console.log('User found:', constructedUser.userName) // Log the transformed User
      res.json(constructedUser) // Return the transformed User
    } else {
      res.status(404).json({ error: 'User not found' }) // Handle not found
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Server error' }) // Handle server error
  }
}