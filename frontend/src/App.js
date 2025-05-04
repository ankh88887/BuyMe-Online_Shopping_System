import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NavBar from './Components/NavBar'
import Home from "./Pages/Home"
import { CartContext } from './Components/CartContext'
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

  useEffect(() => {
    const navBar = document.querySelector('nav');
    if (navBar) {
      setNavHeight(navBar.offsetHeight); // Get the height of the nav bar
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
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
              <Route path=":id" element={<Search />} />
            </Route>
            <Route path="/payment" element={<Payment />} />
              <Route path="*" element={<p>404 not found</p>} />
            </Routes >
          </div>
        </CartContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;