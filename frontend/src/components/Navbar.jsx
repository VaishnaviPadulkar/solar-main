import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <i className="bi bi-sun-fill me-2"></i>
                    Solar Solutions
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                                to="/about"
                            >
                                About
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                                to="/dashboard"
                            >
                                Dashboard
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}
                                to="/calculator"
                            >
                                Calculator
                            </Link>
                        </li> */}
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/gallary' ? 'active' : ''}`}
                                to="/gallary"
                            >
                                Gallery
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
                                to="/contact"
                            >
                                Contact
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                                to="/login"
                            >
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;