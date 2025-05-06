import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from './Components/NavBar';
import Home from "./Pages/Home";
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
import ProtectedRoute from "./Components/protectedroute";

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const navBar = document.querySelector('nav');
    if (navBar) {
      setNavHeight(navBar.offsetHeight); // Get the height of the nav bar
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <AppContent navHeight={navHeight} cartItems={cartItems} setCartItems={setCartItems} />
      </BrowserRouter>
    </div>
  );
}

function AppContent({ navHeight, cartItems, setCartItems }) {
  const location = useLocation(); // Move useLocation here
  const hideNavBarRoutes = ['/login', '/signup', '/forgetpw'];

  return (
    <>
      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
      <CartContext.Provider value={{ cartItems, setCartItems }}>
        <div style={{ marginTop: `${navHeight}px`, overflowY: 'auto', overflowX: 'auto' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/forgetpw" element={<ForgetPasswordPage />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
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
            <Route path="/product" element={<Product />}>
              <Route path=":id" element={<Product />} />
            </Route>
            <Route path="/search" element={<Search />}>
              <Route path=":keywords" element={<Search />} />
            </Route>
            <Route path="*" element={<p>404 not found</p>} />
          </Routes>
        </div>
      </CartContext.Provider>
    </>
  );
}

export default App;