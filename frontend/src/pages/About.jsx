import React from "react";
import "./styles/About.css";
import Pannel from '../../public/images/pannel7.webp'

function About() {
    return (
        <div className="about-container">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="about-title">
                                Powering the Future with <span className="text-gradient">Solar Energy</span>
                            </h1>
                            <p className="about-subtitle">
                                We're committed to making sustainable energy accessible to everyone,
                                creating a brighter, cleaner future for generations to come.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-image-wrapper">
                                <img
                                    src={Pannel}
                                    alt="Solar Panels"
                                    className="about-main-image"
                                />
                                <div className="floating-card card-1">
                                    <i className="bi bi-lightning-charge-fill"></i>
                                    <span>Clean Energy</span>
                                </div>
                                <div className="floating-card card-2">
                                    <i className="bi bi-graph-up-arrow"></i>
                                    <span>Save 70%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container">
                <div className="mission-grid">
                    <div className="mission-card">
                        <div className="mission-icon">
                            <i className="bi bi-bullseye"></i>
                        </div>
                        <h3>Our Mission</h3>
                        <p>Democratize access to clean energy and accelerate the world's transition to sustainable power sources.</p>
                    </div>

                    <div className="mission-card">
                        <div className="mission-icon">
                            <i className="bi bi-eye"></i>
                        </div>
                        <h3>Our Vision</h3>
                        <p>A world where every home and business is powered by affordable, reliable solar energy.</p>
                    </div>

                    <div className="mission-card">
                        <div className="mission-icon">
                            <i className="bi bi-heart"></i>
                        </div>
                        <h3>Our Values</h3>
                        <p>Sustainability, innovation, and customer-centric solutions drive everything we do.</p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="row text-center">
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h2 className="stat-number">500+</h2>
                                <p className="stat-label">Projects Completed</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h2 className="stat-number">85%</h2>
                                <p className="stat-label">Energy Savings</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h2 className="stat-number">24/7</h2>
                                <p className="stat-label">Customer Support</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6 mb-4">
                            <div className="stat-item">
                                <h2 className="stat-number">10+</h2>
                                <p className="stat-label">Years Experience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;