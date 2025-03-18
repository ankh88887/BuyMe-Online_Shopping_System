import React from "react";
import { Link } from "react-router-dom";
import logo from "../Images/BuyMe_Logo_Transparent.PNG";

class NavBar extends React.Component {
    render() {
        return (
            <nav class="navbar sticky-top navbar-expand-lg bg-white dark-bg">
                <div class="container-fluid">
                    <Link class="nav-brand" to="/">
                        <img src={logo} alt="BuyMeLogo" height="50" />
                    </Link>
                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link class="nav-link active" to="/">
                                    Home
                                </Link>
                            </li>

                            <li class="nav-item">
                                <Link class="nav-link" to="/product">
                                    Product
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;