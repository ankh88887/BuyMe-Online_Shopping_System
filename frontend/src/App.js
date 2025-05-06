import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { CurrentLoginUser } from './Components/CurrentLoginUser'
import { CartContext } from './Components/CartContext'
import NavBar from './Components/NavBar'
import Home from "./Pages/Home"
import Product from './Pages/Product'
import Search from './Pages/Search'
import AdminPage from './Pages/Admin'
import UserProfilePage from './Pages/UserProfile'
import ResetPasswordPage from './Pages/ResetPassword'
import PurchaseHistory from './Pages/PurchaseHistory'
import ShoppingCart from './Pages/ShoppingCart'
import Payment from './Pages/Payment'

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const [cartItems, setCartItems] = useState([])
  const [currentUser, setCurrentUser] = useState({
    userID: "currentUserID",
    isAdmin: false,
    userName: "currentUserName",
    password: "currentUserPassword",
    email: "currentUserEmail",
    address: "currentUserAddress"
  });

  useEffect(() => {
    const navBar = document.querySelector('nav');
    if (navBar) {
      setNavHeight(navBar.offsetHeight); // Get the height of the nav bar
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <CurrentLoginUser.Provider value={{ currentUser, setCurrentUser }}>
          <NavBar />
          <CartContext.Provider value={{ cartItems, setCartItems }}>
            <div style={{ marginTop: `${navHeight}px`, overflowY: 'auto', overflowX: 'auto' }}>
              <Routes >
                <Route path="/" element={<Home />} />

                <Route path="/product" element={<Product />}>
                  <Route path=":id" element={<Product />} />
                </Route>

                <Route path="/admin" element={<AdminPage />} />

                <Route path="/profile" element={<UserProfilePage />} />

                <Route path="/reset-password" element={<ResetPasswordPage />} />

                <Route path="/history" element={<PurchaseHistory />} />

                <Route path="/cart" element={<ShoppingCart />} />

                <Route path="/search" element={<Search />}>
                  <Route path=":keywords" element={<Search />} />
                </Route>

                <Route path="*" element={<p>404 not found</p>} />
              </Routes >
            </div>
          </CartContext.Provider>
        </CurrentLoginUser.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;