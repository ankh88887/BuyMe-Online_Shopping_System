import express from "express";
import { 
    createUser, 
    deleteUser, 
    getUserById, 
    getUsers, 
    updateUser,
    createProduct,
    getProductById,
    getAllProducts,
    updateProduct,
    deleteProduct
} from "../routes/adminRoutes.js";
// import { generateToken } from "../utils/generateToken.js"; // Import token generator if needed

const AdminRouter = express.Router();

// ==================== USER ROUTES ====================

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
        const { userName, password, email, isAdmin, address } = req.body;
        
        const user = await createUser(userName, password, email, isAdmin);
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                userName: user.userName,
                email: user.email,
                isAdmin: user.isAdmin,
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
        const { userName, password, email, isAdmin, address } = req.body;
        
        const updatedUser = await updateUser(userID, userName, password, email, isAdmin, address);
        
        if (updatedUser) {
            res.json({
                _id: updatedUser._id,
                userName: updatedUser.userName,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
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

// ==================== PRODUCT ROUTES ====================

// @desc    Get all products
// @route   GET /admin/products
// @access  Private/Admin
AdminRouter.get("/products", async (req, res) => {
    try {
        const products = await getAllProducts();
        
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create product
// @route   POST /admin/products
// @access  Private/Admin
AdminRouter.post("/products", async (req, res) => {
    try {
        const {productName, price, stock, description } = req.body;
        
        const product = await createProduct(productName, price, stock, description);
        
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

// @desc    Get product by ID
// @route   GET /admin/products/:id
// @access  Private/Admin
AdminRouter.get("/products/:id", async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        
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

// @desc    Update product
// @route   PUT /admin/products/:id
// @access  Private/Admin
AdminRouter.put("/products/:id", async (req, res) => {
    try {
        const productID = req.params.id;
        const { productName, price, stock, description } = req.body;
        
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

// @desc    Delete product
// @route   DELETE /admin/products/:id
// @access  Private/Admin
AdminRouter.delete("/products/:id", async (req, res) => {
    try {
        const productID = req.params.id;
        const product = await deleteProduct(productID);
        
        if (product) {
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
