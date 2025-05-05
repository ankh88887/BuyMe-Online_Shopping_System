import express from "express";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../routes/adminRoutes.js";
// Uncomment and update import path if needed
import { createProduct, deleteProduct, retrieveProducts, updateProduct } from "../routes/adminRoutes.js";
// import { generateToken } from "../utils/generateToken.js"; // Import token generator if needed

const AdminRouter = express.Router();

// @desc    Get all users
// @route   GET /admin/users
// @access  Private/Admin
AdminRouter.get("/users", async (req, res) => {
    try {
        const { isAdmin } = req.query;
        const users = await getUsers(isAdmin);
        
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new user
// @route   POST /admin/users
// @access  Private/Admin
AdminRouter.post("/users", async (req, res) => {
    try {
        const { name, email, password, role, address } = req.body;
        
        const user = await createUser(name, password, email, role === 'admin');
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                // token: generateToken(user._id), // Uncomment if using tokens
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user by ID
// @route   GET /admin/users/:id
// @access  Private/Admin
AdminRouter.get("/users/:userID", async (req, res) => {
    try {
        const { userID } = req.params;
        const user = await getUserById(userID);
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update user
// @route   PUT /admin/users/:id
// @access  Private/Admin
AdminRouter.put("/users/:userID", async (req, res) => {
    try {
        const { userID } = req.params;
        const { name, password, email, role, address } = req.body;
        
        const updatedUser = await updateUser(userID, name, password, email, role === 'admin', address);
        
        if (updatedUser) {
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: updatedUser.address,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete user
// @route   DELETE /admin/users/:id
// @access  Private/Admin
AdminRouter.delete("/users/:userID", async (req, res) => {
    try {
        const { userID } = req.params;
        const deletedUser = await deleteUser(userID);
        
        if (deletedUser) {
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create event
// @route   POST /admin/events
// @access  Private/Admin
AdminRouter.post("/products", async (req, res) => {
    try {
        const { productID, productName, price, stock, description } = req.body;
        
        const event = await createProduct(productID, productName, price, stock, description);
        
        if (product) {
            res.status(201).json(product);
        } else {
            res.status(400).json({ message: 'Invalid product data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get events by ID
// @route   GET /admin/events/:id
// @access  Private/Admin
AdminRouter.get("/products/:id", async (req, res) => {
    try {
        const products = await retrieveProducts(req.params.id);
        
        if (products) {
            res.json(products);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update event
// @route   PUT /admin/events/:id
// @access  Private/Admin
AdminRouter.put("/products/:id", async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { productID, productName, price, stock, description } = req.body;
        
        const product = await updateProduct(productID, productName, price, stock, description);
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Delete event
// @route   DELETE /admin/events/:id
// @access  Private/Admin
AdminRouter.delete("/products/:id", async (req, res) => {
    try {
        const { id: productId } = req.params;
        const event = await deleteProduct(productId);
        
        if (event) {
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export { AdminRouter };
