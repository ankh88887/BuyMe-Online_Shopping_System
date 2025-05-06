import { Link } from 'react-router-dom';
import React, { useContext, useState } from "react"
import { CurrentLoginUser } from "./CurrentLoginUser"
import styles from './NavBar.module.css';

export default function NavBar() {
    const [keywords, setKeywords] = useState('')
    const { currentUser, setCurrentUser } = useContext(CurrentLoginUser)

    const logoutOnClick = () => {
        // implement logout logic here
        // For example, clear user session, redirect to login page, etc.
        console.log(`Is the user is an admin(before change): ${currentUser.isAdmin}`);
        setCurrentUser({
            userID: "currentUserID",
            isAdmin: !currentUser.isAdmin,
            userName: "currentUserName",
            password: "currentUserPassword",
            email: "currentUserEmail",
            address: "currentUserAddress"
        });
    };

    React.useEffect(() => {
        console.log("The current user is: ", currentUser);
        console.log(`Is the user is an admin: ${currentUser.isAdmin}`);
    }, [currentUser]); // For logging, can be removed later

    const handleKeywordsChange = (event) => {
        setKeywords(event.target.value);
    }

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
                <input type="text" placeholder="Search..." className={styles.searchBar} value={keywords} onChange={handleKeywordsChange} onKeyDown={handleKeyDown} />
                <Link to={'/search/' + keywords} className={styles.imgButton}>
                    <img src={process.env.PUBLIC_URL + '/Images/search.png'} alt="Search" className={styles.imgIcon} />
                </Link>
            </div>

            {/* Right Section */}
            <div className={styles.right}>
                {currentUser.isAdmin && <Link to="/admin" className={styles.navButton}>Admin Panel</Link>}
                <button onClick={logoutOnClick} className={styles.navButton}>Logout</button>
                <Link to="/cart" className={styles.imgButton}>
                    <img src={process.env.PUBLIC_URL + '/Images/shoppingCart.png'} alt="Shopping Cart" className={styles.imgIcon} />
                </Link>
            </div>
        </nav>
    );
}