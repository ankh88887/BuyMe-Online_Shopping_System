const User = require('../models/User');


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
//router.post('/login', LoginUser);
//router.post('/register', RegisterUser);
//router.put('/change-password/:userId', ForgetPassword);


// @desc    Get single User by username
// @route   GET /api/users/search/:userName
exports.getUserByUsername = async (req, res) => {
  const userName = req.params.userName; // Get the UserName from the request parameters
  try {
    const user = await User.findOne({ userName: userName }); // Search for the user by userID
    console.log('Searching for user with:', userName); // Log the search
    console.log('User found:', user); // Log the found user
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



// @desc    Let users to Login
// @route   GET /api/Users/login

exports.LoginUser = async (req, res) => {
  const { userNameOrEmail, password } = req.body;

  if (!userNameOrEmail || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required' });
  }

  try {
    console.log('Searching for user with:', userNameOrEmail);
    const user = await User.findOne({
      $or: [
        { userName: { $regex: userNameOrEmail, $options: 'i' } }, // Case-insensitive search for username
        { email: { $regex: userNameOrEmail, $options: 'i' } }    // Case-insensitive search for email
      ]
    });
    console.log('User found:', user); // Log the found user

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid username/email' });
    }

    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (password === user.password) {
      res.json(UserConstructor(user));
    }
    else {
      console.log('entered password:', password);
      console.log('User password:', user.password);
      return res.status(401).json({ error: 'Invalid password' });
    }

  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    First time register a user (default is not admin)
// @route   GET /api/Users/register

exports.RegisterUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, with letters and numbers
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain both letters and numbers.' });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      password, // Make sure to hash the password before saving
      //password: await bcrypt.hash(password, 10), // Hash the password before saving
      isAdmin: false, // Default to false
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//exports.RegisterUser = async (req, res) => {
//  try {
//    const { userName, password, email, isAdmin} = req.body;
//    
//    const user = await createUser(userName, password, email, isAdmin);
//   
//    if (user) {
//        res.status(201).json({
//            _id: user._id,
//            userName: user.userName,
//            email: user.email,
//           isAdmin: False,
//            address: user.address,
//            // token: generateToken(user._id), // Uncomment if using tokens/
//        });
//    } else {
//        res.status(400).json({ message: 'Invalid user data' });
//    }
//} catch (error) {
//    console.error(error);
//    res.status(500).json({ message: 'Server Error' });
//}
//};


// @desc    change passoword requested by user
// @route   GET /api/Users/forget-password/:userID

exports.ForgetPassword = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;

    // Check if all required fields are provided
    if (!userName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 8 characters, with letters and numbers
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain both letters and numbers.' });
    }

    // Find the user by username and email
    const user = await User.findOne({ userName, email });

    if (!user) {
      return res.status(404).json({ message: 'Username and Email do not match' });
    }

    // Hash the new password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Notify the user and redirect them to the login page
    res.status(200).json({ message: 'Password updated successfully. Please log in with your new password.' });
  } catch (error) {
    console.error('Error in ForgetPassword:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// // @desc    Get all Users
// // @route   GET /api/Users
// // @access  Public
// exports.getUsers = async (req, res) => {
//   try {
//     const Users = await User.find({});
//     if (Users) {
//       console.log('User found:', Users); // Log the found User
//       res.json({
//         Users: Users.map((User) => (UserConstructor(User)))
//       })
//     } else {
//       res.status(404).json({ error: 'User not found' }); // Handle not found
//     }
//   } catch (error) {
//     console.error('Error fetching User:', error);
//     res.status(500).json({ error: 'Server error' }); // Handle server error
//   }
// };

// // @desc    Get single User by ID
// // @route   GET /api/Users/:id
// exports.getUserById = async (req, res) => {
//   const UserID = req.params.id; // Get the UserID from the request parameters
//   try {
//     const User = await User.findOne({ UserID: UserID }); // Search for the User by UserID
//     if (User) {
//       const constructedUser = UserConstructor(User); // Transform the User
//       console.log('User found:', constructedUser); // Log the transformed User
//       res.json(constructedUser); // Return the transformed User
//     } else {
//       res.status(404).json({ error: 'User not found' }); // Handle not found
//     }
//   } catch (error) {
//     console.error('Error fetching User:', error);
//     res.status(500).json({ error: 'Server error' }); // Handle server error
//   }
// };


// // @desc    Get Users with keyword
// // @route   GET /api/Users/search/:keyword
// exports.getUsersByKeyword = async (req, res) => {
//   const keyword = req.params.keyword.toLowerCase(); // Get the keyword from the request parameters and convert to lowercase
//   try {
//     // Search for Users where the UserName or description contains the keyword (case-insensitive)
//     const Users = await User.find({ UserName: { $regex: keyword, $options: 'i' } });

//     if (Users.length > 0) {
//       console.log(`${Users.length} User(s) found with keyword: ${keyword}`); // Log the number of Users found
//       res.json({
//         Users: Users.map((User) => UserConstructor(User)) // Transform the Users using UserConstructor
//       });
//     } else {
//       console.log(`No Users found with keyword: ${keyword}`); // Log no Users found
//       res.status(404).json({ error: 'No Users found' }); // Handle not found
//     }
//   } catch (error) {
//     console.error('Error fetching Users by keyword:', error); // Log the error
//     res.status(500).json({ error: 'Server error' }); // Handle server error
//   }
// };







// import express from "express";
// import { 
//     createUser, 
//     getUserById, 
//     getUsers, 
//     updateUser,
// } from "../routes/userRoutes.js";
// // import { generateToken } from "../utils/generateToken.js"; // Import token generator if needed

// const userRouter = express.Router();

// // ==================== USER ROUTES ====================

// // @desc    Get all users
// // @route   GET /admin/users
// // @access  Private/Admin
// userRouter.get("/users", async (req, res) => {
//     try {
//         const { isAdmin } = req.query;
//         const users = await getUsers(isAdmin);
        
//         res.json(users);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// // @desc    Create a new user
// // @route   POST /admin/users
// // @access  Private/Admin
// userRouter.post("/users", async (req, res) => {
//     try {
//         const { userName, password, email, isAdmin, address } = req.body;
        
//         const user = await createUser(userName, password, email, isAdmin);
        
//         if (user) {
//             res.status(201).json({
//                 _id: user._id,
//                 userName: user.userName,
//                 email: user.email,
//                 isAdmin: user.isAdmin,
//                 address: user.address,
//                 // token: generateToken(user._id), // Uncomment if using tokens
//             });
//         } else {
//             res.status(400).json({ message: 'Invalid user data' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// // @desc    Get user by ID
// // @route   GET /admin/users/:id
// // @access  Private/Admin
// userRouter.get("/users/:userID", async (req, res) => {
//     try {
//         const { userID } = req.params;
//         const user = await getUserById(userID);
        
//         if (user) {
//             res.json(user);
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// // @desc    Update user
// // @route   PUT /admin/users/:id
// // @access  Private/Admin
// userRouter.put("/users/:userID", async (req, res) => {
//     try {
//         const { userID } = req.params;
//         const { userName, password, email, isAdmin, address } = req.body;
        
//         const updatedUser = await updateUser(userID, userName, password, email, isAdmin, address);
        
//         if (updatedUser) {
//             res.json({
//                 _id: updatedUser._id,
//                 userName: updatedUser.userName,
//                 email: updatedUser.email,
//                 isAdmin: updatedUser.isAdmin,
//                 address: updatedUser.address,
//             });
//         } else {
//             res.status(404).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });





