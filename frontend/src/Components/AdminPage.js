import React, { useState, useEffect, useCallback } from "react";
import Alert from "./AdminPageAlert";
import "./AdminPage.css";

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState("newProduct");
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showUserForm, setShowUserForm] = useState(false);
    const [showProductForm, setShowProductForm] = useState(false);
    const [formData, setFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(5);
    const [productsPerPage] = useState(5);

    const [alert, setAlert] = useState({ message: "", type: "", visible: false });

    const showAlert = (message, type) => {
        setAlert({ message, type, visible: true });
    };

    const closeAlert = () => {
        setAlert({ ...alert, visible: false });
    };

    const handleReset = useCallback(() => {
        const initialFormData = {
            productId: "",
            name: "",
            price: "",
            stock: "",
            description: "",
            username: "",
            password: "",
            email: "",
            isAdmin: false,
        };
        setFormData(initialFormData);
        setSelectedUser(null);
        setSelectedProduct(null);
        setShowUserForm(false);
        setShowProductForm(false);
    }, []);

    useEffect(() => {
        if (activeTab === "modifyUser") {
            fetchUsers();
        }
        if (activeTab === "modifyProduct") {
            fetchProducts();
        }
        handleReset();
        setCurrentPage(1);
    }, [activeTab, handleReset]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            if (data.success) {
                const combinedUsers = data.user.map((user) => ({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                }));
                setUsers(combinedUsers);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/products/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            if (data.success) {
                return data.user;
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
        return null;
    };

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/products/${productId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            const data = await response.json();
            if (data.success) {
                return data.product;
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
        return null;
    };

    const handleCreateProduct = async () => {
        if (!formData.name) {
            showAlert("Please enter a product name.", "error");
            return;
        }
        if (!formData.price) {
            showAlert("Please enter a price.", "error");
            return;
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    productId: formData.productId,
                    name: formData.name,
                    price: formData.price,
                    stock: formData.stock,
                    description: formData.description,
                }),
            });
            const data = await response.json();
            if (data.success) {
                handleReset();
                showAlert(`Product [${formData.name}] created successfully!`, "success");
            } else {
                showAlert("The product has already existed.", "error");
            }
        } catch (error) {
            console.error("Error creating product:", error);
            showAlert("Failed to create product.", "error");
        }
    };

    const handleCreateUser = async () => {
        if (!formData.password) {
            showAlert("Please enter a password.", "error");
            return;
        }
        if (!formData.username) {
            showAlert("Please enter a username.", "error");
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                username: formData.username,
                password: formData.password,
                email: formData.email,
                isAdmin: formData.isAdmin,
            }),
        });
        const data = await response.json();
        if (data.success) {
            handleReset();
            if (formData.isAdmin) {
                showAlert(`Admin [${formData.username}] created successfully!`, "success");
            } else {
                showAlert(`User [${formData.username}] created successfully!`, "success");
            }
        } else {
            showAlert("Username has been taken already.", "error");
        }
    };

    /*const handleInputChange = (e) => {
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        
        // For number fields, ensure they don't go below 0
        if ((e.target.name === "price" || e.target.name === "stock") && e.target.type === "number") {
            const numValue = parseFloat(value);
            if (isNaN(numValue) || numValue < 0) {
                value = 0;
            } else {
                value = numValue;
            }
        }

        setFormData({ ...formData, [e.target.name]: value });
    };*/

    const handleInputChange = (e) => {
        let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        
        // For number fields (price and stock)
        if ((e.target.name === 'price' || e.target.name === 'stock') && e.target.type === 'number') {
            // Remove leading zeros and convert to number
            value = value.replace(/^0+/, '') || '0';  // Remove leading zeros, default to '0' if empty
            value = parseFloat(value);  // Convert to number
            
            // Ensure it's not negative
            value = Math.max(0, value);
            
            // If the value is 0 and the user is typing, keep it as string to allow typing
            if (value === 0 && e.target.value !== '0') {
                value = e.target.value.replace(/^0+/, '') || '0';
            } else {
                value = value.toString();  // Convert back to string for the input
            }
        }
        
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleManageUser = async (user) => {
        const userDetails = await fetchUserDetails(user._id);
        if (userDetails) {
            setSelectedUser(userDetails);
            setFormData({
                ...formData,
                username: userDetails.username,
                password: "",
                email: userDetails.email,
                isAdmin: userDetails.isAdmin,
            });
            setShowUserForm(true);
        }
    };

    const handleManageProduct = async (product) => {
        const productDetails = await fetchProductDetails(product._id);
        if (productDetails) {
            setSelectedProduct(productDetails);
            setFormData({
                ...formData,
                productId: productDetails.productId,
                name: productDetails.name,
                price: productDetails.price,
                stock: productDetails.stock,
                description: productDetails.description,
            });
            setShowProductForm(true);
        }
    };

    const handleUpdateUser = async () => {
        try {
            const previousIsAdmin = selectedUser.isAdmin;
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${selectedUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    isAdmin: formData.isAdmin,
                }),
            });
            const data = await response.json();
            if (data.success) {
                console.log("User updated successfully");
                setShowUserForm(false);
                fetchUsers();
                handleReset();
                if (previousIsAdmin === formData.isAdmin) {
                    if (formData.isAdmin) {
                        showAlert(`Admin [${formData.username}] updated successfully!`, "success");
                    } else {
                        showAlert(`User [${formData.username}] updated successfully!`, "success");
                    }
                } else {
                    if (formData.isAdmin) {
                        showAlert(`[${formData.username}] has been updated to an Admin!`, "success");
                    } else {
                        showAlert(`[${formData.username}] has been updated to an User!`, "success");
                    }
                }
            } else {
                showAlert("Username has been taken already.", "error");
            }
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/products/${selectedProduct._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    productId: formData.productId,
                    name: formData.name,
                    price: formData.price,
                    stock: formData.stock,
                    description: formData.description,
                }),
            });
            const data = await response.json();
            if (data.success) {
                console.log("Product updated successfully");
                setShowProductForm(false);
                fetchProducts();
                handleReset();
                showAlert(`Product [${formData.name}] updated successfully!`, "success");
            } else {
                showAlert("Failed to update product.", "error");
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${selectedUser._id}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            });
            const data = await response.json();
            if (data.success) {
                console.log("User deleted successfully");
                setShowUserForm(false);
                fetchUsers();
                handleReset();
                if (selectedUser.isAdmin) {
                    showAlert(`Admin [${formData.username}] deleted successfully!`, "success");
                } else {
                    showAlert(`User [${formData.username}] deleted successfully!`, "success");
                }
            } else {
                showAlert("Failed to delete user.", "error");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/admin/products/${selectedProduct._id}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + localStorage.getItem("token") },
            });
            const data = await response.json();
            if (data.success) {
                console.log("Product deleted successfully");
                setShowProductForm(false);
                fetchProducts();
                handleReset();
                showAlert(`Product [${formData.name}] deleted successfully!`, "success");
            } else {
                showAlert("Failed to delete product.", "error");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        switch (activeTab) {
            case "newProduct":
                handleCreateProduct();
                break;
            case "createUser":
                handleCreateUser();
                break;
            case "modifyUser":
                handleUpdateUser();
                break;
            case "modifyProduct":
                handleUpdateProduct();
                break;
            default:
                break;
        }
    };

    const Pagination = ({ totalItems, paginate, currentPage, itemsPerPage }) => {
        const pageNumbers = [];
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                <button className="pagination-arrow" onClick={() => currentPage > 1 && paginate(currentPage - 1)} disabled={currentPage === 1}>
                    {" "}
                    ←{" "}
                </button>
                {pageNumbers.map((number) => (
                    <button key={number} className={`pagination-number ${currentPage === number ? "active" : ""}`} onClick={() => paginate(number)}>
                        {number}
                    </button>
                ))}
                <button className="pagination-arrow" onClick={() => currentPage < totalPages && paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    {" "}
                    →{" "}
                </button>
            </div>
        );
    };

    const UserList = ({ users }) => {
        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

        return (
            <div className="user-group">
                <h3>User List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? "Admin" : "Regular User"}</td>
                                <td>
                                    <button onClick={() => handleManageUser(user)}>Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination totalItems={users.length} paginate={setCurrentPage} currentPage={currentPage} itemsPerPage={usersPerPage} />
            </div>
        );
    };

    const ProductList = ({ products }) => {
        const indexOfLastProduct = currentPage * productsPerPage;
        const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
        const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

        return (
            <div className="user-group">
                <h3>Product List</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Product ID</th>
                            <th>Product name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((product) => (
                            <tr key={product._id}>
                                <td>{product.productId}</td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>${product.stock}</td>
                                <td>${product.description}</td>
                                <td>
                                    <button onClick={() => handleManageProduct(product)}>Manage</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination totalItems={products.length} paginate={setCurrentPage} currentPage={currentPage} itemsPerPage={productsPerPage} />
            </div>
        );
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="admin-tabs">
                    <button className={activeTab === "newProduct" ? "active" : ""} onClick={() => setActiveTab("newProduct")} style={{ fontWeight: "bold" }}>
                        New Product
                    </button>
                    <button className={activeTab === "modifyProduct" ? "active" : ""} onClick={() => setActiveTab("modifyProduct")} style={{ fontWeight: "bold" }}>
                        Modify Product
                    </button>
                    <button className={activeTab === "createUser" ? "active" : ""} onClick={() => setActiveTab("createUser")} style={{ fontWeight: "bold" }}>
                        Create User
                    </button>
                    <button className={activeTab === "modifyUser" ? "active" : ""} onClick={() => setActiveTab("modifyUser")} style={{ fontWeight: "bold" }}>
                        Modify User
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {alert.visible && <Alert message={alert.message} type={alert.type} onClose={closeAlert} />}
                
                {activeTab === "modifyUser" && !showUserForm && (
                    <div className="user-list">
                        <UserList users={users} />
                    </div>
                )}
                
                {activeTab === "modifyProduct" && !showProductForm && (
                    <div className="user-list">
                        <ProductList products={products} />
                    </div>
                )}
                
                {(activeTab === "newProduct" || activeTab === "createUser" || 
                  (activeTab === "modifyUser" && showUserForm) || 
                  (activeTab === "modifyProduct" && showProductForm)) && (
                    <form onSubmit={handleSubmit}>
                        {activeTab === "newProduct" && (
                            <div className="form-content">
                                <div className="form-row">
                                    <label>Product ID:</label>
                                    <input type="text" name="productId" value={formData.productId} onChange={handleInputChange} required />
                                </div>
                                <div className="form-row">
                                    <label>Product name:</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-row">
                                    <label>Price:</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.1" required />
                                </div>
                                <div className="form-row">
                                    <label>Stock:</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" step="1" required />
                                </div>
                                <div className="form-row">
                                    <label>Description:</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === "createUser" && (
                            <div className="form-content">
                                <div className="form-row">
                                    <label>Username:</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                                </div>
                                <div className="form-row">
                                    <label>Password:</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Please input the password" />
                                </div>
                                <div className="form-row">
                                    <label>Email:</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Please input the email" />
                                </div>
                                <div className="form-row">
                                    <span>Is Admin</span>
                                    <label className="switch">
                                        <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleInputChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === "modifyUser" && showUserForm && (
                            <div className="form-content">
                                <div className="form-row">
                                    <label>Username:</label>
                                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                                </div>
                                <div className="form-row">
                                    <label>Password:</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Please input the password" />
                                </div>
                                <div className="form-row">
                                    <label>Email:</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Please input the email" />
                                </div>
                                <div className="form-row">
                                    <span>Is Admin</span>
                                    <label className="switch">
                                        <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleInputChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        )}
                        
                        {activeTab === "modifyProduct" && showProductForm && (
                            <div className="form-content">
                                <div className="form-row">
                                    <label>Product ID:</label>
                                    <input type="text" name="productId" value={formData.productId} onChange={handleInputChange} required />
                                </div>
                                <div className="form-row">
                                    <label>Product name:</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-row">
                                    <label>Price:</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
                                </div>
                                <div className="form-row">
                                    <label>Stock:</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                                </div>
                                <div className="form-row">
                                    <label>Description:</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange}></textarea>
                                </div>
                            </div>
                        )}
                        
                        <div className="form-actions">
                            {activeTab === "modifyUser" && showUserForm ? (
                                <>
                                    <button type="button" className="btn-save" onClick={handleUpdateUser}>
                                        Save
                                    </button>
                                    <button type="button" className="btn-delete" onClick={handleDeleteUser}>
                                        Delete
                                    </button>
                                </>
                            ) : activeTab === "modifyProduct" && showProductForm ? (
                                <>
                                    <button type="button" className="btn-save" onClick={handleUpdateProduct}>
                                        Save
                                    </button>
                                    <button type="button" className="btn-delete" onClick={handleDeleteProduct}>
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button type="submit" className="btn-update">
                                    {activeTab === "newProduct" ? "Create" : "Create"}
                                </button>
                            )}
                            <button type="button" className="btn-decline" onClick={handleReset}>
                                Reset
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminPage;