// import "./App.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import React from "react";
// import NavBar from "./Components/NavBar";
// import Home from "./Pages/Home";
// import Login from "./Pages/Login";
// import Signup from "./Pages/Signup";
// import Product from "./Pages/Product";

// class App extends React.Component {
//   render() {
//       return (
//           <div>
//               <Router>
//                   <NavBar />
//                     <Routes>
//                       <Route exact path="/" element={<Home />} />
//                       <Route exact path="/login" element={<Login />} />
//                       <Route exact path="/signup" element={<Signup />} />
//                       <Route exact path="/product" element={<Product />} />
//                     </Routes>
//               </Router>
//           </div>
//       );
//   }
// }

// export default App;


import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import NavBar from './navbar'
import Home from "./Home"
import ProductMain from './ProductMain'
import Search from './search'
import AdminPage from './Pages/Admin'
import UserProfilePage from './Pages/UserProfile'
import ResetPasswordPage from './Pages/ResetPassword'

function App() {
  const [navHeight, setNavHeight] = useState(0);

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
        <div style={{ marginTop: `${navHeight}px`, overflowY: 'auto', overflowX: 'auto' }}>
          <Routes >
            <Route path="/" element={<Home />} />

            <Route path="/product" element={<ProductMain />}>
              <Route path=":id" element={<ProductMain />} />
            </Route>

            <Route path="/admin" element={<AdminPage />} />

            <Route path="/profile" element={<UserProfilePage />} />

            <Route path="/reset-password" element={<ResetPasswordPage />} />

            <Route path="/search" element={<Search />}>
              <Route path=":id" element={<Search />} />
            </Route>

            <Route path="*" element={<p>404 not found</p>} />
          </Routes >
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;