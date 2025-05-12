import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState} from "react";
import { CurrentLoginUser } from "./CurrentLoginUser";
import { CartContext } from './CartContext'; // Import CartContext
import styles from './NavBar.module.css';

export default function NavBar() {
    const [keywords, setKeywords] = useState('');
    const { currentUser, setCurrentUser } = useContext(CurrentLoginUser);
    const { setCartItems } = useContext(CartContext); // Access setCartItems from CartContext
    const navigate = useNavigate(); // Hook for navigation

    const logoutOnClick = () => {
        if (currentUser) {
            console.log(`Logging out user: ${currentUser.userName}`);
            setCurrentUser(null); // Clear the current user
            localStorage.removeItem('currentUser'); // Clear user from localStorage
            setCartItems([]); // Clear all items in the cart
            navigate('/logout'); // Redirect to the logout page
        }
    };

    const handleKeywordsChange = (event) => {
        setKeywords(event.target.value);
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
                />
                <Link to={'/search/' + keywords} className={styles.imgButton}>
                    <img src={process.env.PUBLIC_URL + '/Images/search.png'} alt="Search" className={styles.imgIcon} onClick={()=>{setKeywords("") }} />
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
                    <img src={process.env.PUBLIC_URL + '/Images/shoppingCart.png'} alt="Shopping Cart" className={styles.imgIcon}/>
                </Link>
            </div>
        </nav>
    );
}