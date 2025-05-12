import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './Components/NavBar';
import Home from './Pages/Home';
import { CartContext } from './Components/CartContext';
import Product from './Pages/Product';
import Search from './Pages/Search';
import AdminPage from './Pages/Admin';
import UserProfilePage from './Pages/UserProfile';
import ResetPasswordPage from './Pages/ResetPassword';
import LoginPage from './Pages/Login';
import ForgetPasswordPage from './Pages/ForgetPassword';
import SignUpPage from './Pages/Signup';
import LogoutPage from './Pages/Logout';
import ProtectedRoute from './Components/protectedroute';
import { CurrentLoginUser } from './Components/CurrentLoginUser';
import Payment from './Pages/Payment';
import PurchaseHistory from './Pages/PurchaseHistory';
import ShoppingCart from './Pages/ShoppingCart';

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const navBar = document.querySelector('nav');
    if (navBar) {
      setNavHeight(100);
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <CurrentLoginUser.Provider value={{ currentUser, setCurrentUser }}>
          <CartContext.Provider value={{ cartItems, setCartItems }}>
            <AppContent navHeight={navHeight} />
          </CartContext.Provider>
        </CurrentLoginUser.Provider>
      </BrowserRouter>
    </div>
  );
}

function AppContent({ navHeight }) {
  const location = useLocation();
  const hideNavBarRoutes = ['/login', '/signup', '/forgetpw', '/logout'];

  return (
    <div>
      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
      <div style={{ marginTop: `${navHeight}px`, overflowY: 'auto', overflowX: 'auto' }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgetpw" element={<ForgetPasswordPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <ProtectedRoute>
                <ResetPasswordPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAdmin={true}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<LogoutPage />} />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <PurchaseHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <ShoppingCart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/:keywords"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;