import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import NavBar from "./Components/NavBar";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Product from "./Pages/Product";

class App extends React.Component {
  render() {
      return (
          <div>
              <Router>
                  <NavBar />
                    <Routes>
                      <Route exact path="/" element={<Home />} />
                      <Route exact path="/login" element={<Login />} />
                      <Route exact path="/signup" element={<Signup />} />
                      <Route exact path="/product" element={<Product />} />
                    </Routes>
              </Router>
          </div>
      );
  }
}

export default App;
