import React from "react";
import { Link } from "react-router-dom";
import "./styles/Home.css";
import Pannel from '../../public/images/pannel7.webp'

const Home = () => (
    <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
            <div className="container">
                <div className="row align-items-center min-vh-100">
                    <div className="col-lg-6">
                        <div className="hero-content">
                            <div className="badge-container mb-4">
                                <span className="hero-badge">
                                    <i className="bi bi-lightning-charge-fill me-2"></i>
                                    Clean Energy Solution
                                </span>
                            </div>
                            <h1 className="hero-title">
                                Power Your Life with <span className="text-gradient">Solar Energy</span>
                            </h1>
                            <p className="hero-subtitle">
                                Join thousands of homeowners saving up to 70% on electricity bills
                                while protecting our planet. Start your solar journey today!
                            </p>
                            <div className="hero-actions">
                                <Link to="/calculator" className="btn btn-primary btn-lg me-3">
                                    <i className="bi bi-calculator me-2"></i>
                                    Calculate Savings
                                </Link>
                                <Link to="/about" className="btn btn-outline-light btn-lg">
                                    Learn More
                                </Link>
                            </div>
                            <div className="hero-stats mt-5">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="stat-item">
                                            <h3>500+</h3>
                                            <p>Happy Customers</p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="stat-item">
                                            <h3>70%</h3>
                                            <p>Average Savings</p>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="stat-item">
                                            <h3>24/7</h3>
                                            <p>Support</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="hero-image">
                            <div className="floating-card card-1">
                                <i className="bi bi-graph-up-arrow"></i>
                                <span>Save 70%</span>
                            </div>
                            <div className="floating-card card-2">
                                <i className="bi bi-shield-check"></i>
                                <span>25Y Warranty</span>
                            </div>
                            <div className="floating-card card-3">
                                <i className="bi bi-tree"></i>
                                <span>Eco Friendly</span>
                            </div>
                            <img
                                src={Pannel}
                                // src="/images/pannel7.webp" 
                                alt="Solar Panels"
                                className="img-fluid hero-main-image"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section className="features-section py-5">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="section-title">Why Choose Solar Energy?</h2>
                    <p className="section-subtitle">Discover the benefits of switching to clean, renewable solar power</p>
                </div>
                <div className="row g-4">
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-icon bg-primary">
                                <i className="bi bi-cash-coin"></i>
                            </div>
                            <h4>Cost Effective</h4>
                            <p>Reduce your electricity bills by up to 70% with long-term savings and quick ROI on your investment.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-icon bg-success">
                                <i className="bi bi-recycle"></i>
                            </div>
                            <h4>Eco Friendly</h4>
                            <p>Reduce your carbon footprint and contribute to a cleaner, greener planet for future generations.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-icon bg-warning">
                                <i className="bi bi-shield-check"></i>
                            </div>
                            <h4>Low Maintenance</h4>
                            <p>Solar systems require minimal maintenance with 25+ years of reliable performance and warranty.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-icon bg-info">
                                <i className="bi bi-lightning-charge"></i>
                            </div>
                            <h4>Energy Independent</h4>
                            <p>Generate your own electricity and reduce dependence on grid power with reliable solar energy.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-icon bg-danger">
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <h4>Increased Value</h4>
                            <p>Solar installations increase your property value and make your home more attractive to buyers.</p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <div className="feature-card">
                            <div className="feature-icon bg-purple">
                                <i className="bi bi-award"></i>
                            </div>
                            <h4>Government Incentives</h4>
                            <p>Take advantage of tax credits, rebates, and incentives for going solar in your area.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-5">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-8">
                        <h2 className="cta-title">Ready to Start Your Solar Journey?</h2>
                        <p className="cta-subtitle">Get a free consultation and discover how much you can save with solar energy.</p>
                    </div>
                    <div className="col-lg-4 text-lg-end">
                        <Link to="/contact" className="btn btn-light btn-lg">
                            <i className="bi bi-chat-dots me-2"></i>
                            Get Free Quote
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="footer-section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 mb-4">
                        <div className="footer-brand">
                            <i className="bi bi-sun-fill me-2"></i>
                            <span className="fw-bold">SolarSmart</span>
                        </div>
                        <p className="footer-description">
                            Empowering communities with clean, affordable solar energy solutions.
                            Together, we're building a sustainable future for generations to come.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="social-link"><i className="bi bi-twitter"></i></a>
                            <a href="#" className="social-link"><i className="bi bi-instagram"></i></a>
                            <a href="#" className="social-link"><i className="bi bi-linkedin"></i></a>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <h5>Quick Links</h5>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/calculator">Calculator</Link></li>
                            <li><Link to="/gallary">Gallery</Link></li>
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-4 mb-4">
                        <h5>Services</h5>
                        <ul className="footer-links">
                            <li><a href="#">Residential</a></li>
                            <li><a href="#">Commercial</a></li>
                            <li><a href="#">Installation</a></li>
                            <li><a href="#">Maintenance</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-4 col-md-4 mb-4">
                        <h5>Contact Info</h5>
                        <div className="contact-info">
                            <p><i className="bi bi-geo-alt me-2"></i>Pune, Maharashtra, India</p>
                            <p><i className="bi bi-telephone me-2"></i>+91 00000 00000</p>
                            <p><i className="bi bi-envelope me-2"></i>support@solarsmart.com</p>
                            <p><i className="bi bi-clock me-2"></i>Mon - Sun: 24/7 Support</p>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className="mb-0">
                                &copy; {new Date().getFullYear()} SolarSmart. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="footer-bottom-links">
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                                <a href="#">Cookie Policy</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
);

export default Home;