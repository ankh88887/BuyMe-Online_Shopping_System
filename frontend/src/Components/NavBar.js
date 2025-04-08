import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './NavBar.module.css';

export default function NavBar() {
    let [isAdmin, setIsAdmin] = useState(false)
    const [keywords, setKeywords] = useState('')

    const logoutOnClick = () => {
        setIsAdmin(!isAdmin)
        console.log(isAdmin)
    }

    const handleKeywordsChange = (event) => {
        setKeywords(event.target.value);
    }

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
                <input type="text" placeholder="Search..." className={styles.searchBar} value={keywords} onChange={handleKeywordsChange} />
                <Link to={'/search/' + keywords} className={styles.imgButton}>
                    <img src={process.env.PUBLIC_URL + '/Images/search.png'} alt="Search" className={styles.imgIcon} />
                </Link>
            </div>

            {/* Right Section */}
            <div className={styles.right}>
                {isAdmin && <Link to="/admin" className={styles.navButton}>Admin Panel</Link>}
                <button onClick={logoutOnClick} className={styles.navButton}>Logout</button>
                <Link to="/cart" className={styles.imgButton}>
                    <img src={process.env.PUBLIC_URL + '/Images/shoppingCart.png'} alt="Shopping Cart" className={styles.imgIcon} />
                </Link>
            </div>
        </nav>
    );
}