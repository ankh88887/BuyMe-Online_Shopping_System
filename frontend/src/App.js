import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React, { useContext } from 'react';
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
import { CurrentLoginUser } from './Components/CurrentLoginUser';

function App() {
  const [navHeight, setNavHeight] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); 

  useEffect(() => {
    const navBar = document.querySelector('nav');
    if (navBar) {
      setNavHeight(navBar.offsetHeight);
    }
  }, []);

    // In your App.js or main component
  useEffect(() => {
    // Set the current user to userID = 1 for testing
    const mockUser = {
      userID: "1"
    };
    
    // Store in localStorage for persistence across page refreshes
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("token", "mock-jwt-token-for-testing");
  }, []);


  return (
    <div>
      <BrowserRouter>
        {/* Give the function currentUser and setCurrentUser to the app */}
        <CurrentLoginUser.Provider value={{ currentUser, setCurrentUser }}>
          <AppContent navHeight={navHeight} cartItems={cartItems} setCartItems={setCartItems} />
        </CurrentLoginUser.Provider>
      </BrowserRouter>
    </div>
  );
}

function AppContent({ navHeight, cartItems, setCartItems }) {
  const location = useLocation();
  const hideNavBarRoutes = ['/login', '/signup', '/forgetpw', '/logout'];

  return (
    <div>
      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
      <CartContext.Provider value={{ cartItems, setCartItems }}>
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
    </div>
  );
}

export default App;