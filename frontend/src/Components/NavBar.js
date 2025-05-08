import { Link, useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from "react";
import { CurrentLoginUser } from "./CurrentLoginUser";
import styles from './NavBar.module.css';

export default function NavBar() {
    const [keywords, setKeywords] = useState('');
    const { currentUser, setCurrentUser } = useContext(CurrentLoginUser);
    const navigate = useNavigate(); // Hook for navigation

    //useEffect(() => {
    // Mock admin user for testing
    //     setCurrentUser({
    //        userID: '12345',
    //       userName: 'AdminUser',
    //       email: 'admin@example.com',
    //        isAdmin: true, // Set isAdmin to true for testing
    //    });
    // }, [setCurrentUser]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                // Fetch the current user from the backend or localStorage
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    setCurrentUser(JSON.parse(storedUser)); // Set the user from localStorage
                } else {
                    // Optionally, fetch from an API if not found in localStorage
                    const response = await fetch('http://localhost:5005/api/users/current');
                    if (response.ok) {
                        const user = await response.json();
                        setCurrentUser(user); // Set the user from the API response
                    } else {
                        console.error('Failed to fetch current user');
                    }
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, [setCurrentUser]);

    const logoutOnClick = () => {
        if (currentUser) {
            console.log(`Logging out user: ${currentUser.userName}`);
            setCurrentUser(null); // Clear the current user
            localStorage.removeItem('currentUser'); // Clear user from localStorage
            navigate('/logout'); // Redirect to the logout page
        }
    };

    const handleKeywordsChange = (event) => {
        setKeywords(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            window.location.href = `/search/${keywords}`;
        }
    };

    return (
        <nav className={styles.nav}>
            {/* Left Section */}
            <div className={styles.left}>
                <Link to="/" className={styles.navButton}>Home</Link>
                <Link to="/profile" className={styles.navButton}>User Profile</Link>
                <Link to="/history" className={styles.navButton}>Purchase History</Link>
            </div>

            {/* Middle Section */}
            <div className={styles.middle}>
                <input
                    type="text"
                    placeholder="Search..."
                    className={styles.searchBar}
                    value={keywords}
                    onChange={handleKeywordsChange}
                    onKeyDown={handleKeyDown}
                />
                <Link to={'/search/' + keywords} className={styles.imgButton}>
                    <img src={process.env.PUBLIC_URL + '/Images/search.png'} alt="Search" className={styles.imgIcon} />
                </Link>
            </div>

            {/* Right Section */}
            <div className={styles.right}>
                {/* Conditionally render Admin Panel link */}
                {currentUser?.isAdmin && (
                    <Link to="/admin" className={styles.navButton}>Admin Panel</Link>
                )}
                <button onClick={logoutOnClick} className={styles.navButton}>Logout</button>
                <Link to="/cart" className={styles.imgButton}>
                    <img src={process.env.PUBLIC_URL + '/Images/shoppingCart.png'} alt="Shopping Cart" className={styles.imgIcon} />
                </Link>
            </div>
        </nav>
    );
}