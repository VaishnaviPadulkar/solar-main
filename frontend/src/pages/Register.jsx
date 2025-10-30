import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/Login.css";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));

        // Check password strength
        if (id === "password") {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        if (strongRegex.test(password)) {
            setPasswordStrength("strong");
        } else if (mediumRegex.test(password)) {
            setPasswordStrength("medium");
        } else if (password.length > 0) {
            setPasswordStrength("weak");
        } else {
            setPasswordStrength("");
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case "strong": return "success";
            case "medium": return "warning";
            case "weak": return "danger";
            default: return "secondary";
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case "strong": return "Strong Password";
            case "medium": return "Medium Password";
            case "weak": return "Weak Password";
            default: return "Enter a password";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        const { name, email, password, confirmPassword } = formData;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required!");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                name,
                email,
                password,
            });

            setMessage("🎉 Registration successful! Redirecting to login...");
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);

        } catch (err) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="row g-0 min-vh-100">
                    {/* Left Side - Illustration */}
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="auth-illustration">
                            <div className="illustration-content">
                                <div className="sun-icon">
                                    <i className="bi bi-person-plus-fill"></i>
                                </div>
                                <h2>Join Our Solar Community!</h2>
                                <p>
                                    Create your account and start your journey towards sustainable energy.
                                    Track your savings and contribute to a greener planet.
                                </p>

                                {/* Floating Elements */}
                                <div className="floating-element el-1">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>
                                <div className="floating-element el-2">
                                    <i className="bi bi-lightning-charge"></i>
                                </div>
                                <div className="floating-element el-3">
                                    <i className="bi bi-tree"></i>
                                </div>

                                {/* Benefits List */}
                                <div className="features-list">
                                    <div className="feature-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Track energy savings in real-time</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Monitor solar system performance</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Get personalized recommendations</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Join eco-friendly community</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="col-lg-6">
                        <div className="auth-form-section">
                            <div className="auth-form-container">
                                {/* Back to Home */}
                                <div className="back-home">
                                    <Link to="/" className="back-link">
                                        <i className="bi bi-arrow-left me-2"></i>
                                        Back to Home
                                    </Link>
                                </div>

                                {/* Form Header */}
                                <div className="form-header text-center mb-5">
                                    <div className="auth-icon">
                                        <i className="bi bi-person-plus-fill"></i>
                                    </div>
                                    <h1 className="auth-title">Create Account</h1>
                                    <p className="auth-subtitle">Join thousands saving with solar energy</p>
                                </div>

                                {/* Registration Form */}
                                <form onSubmit={handleSubmit} className="auth-form">
                                    {message && (
                                        <div className="alert alert-success fade-in">
                                            <i className="bi bi-check-circle me-2"></i>
                                            {message}
                                        </div>
                                    )}
                                    {error && (
                                        <div className="alert alert-danger fade-in">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            {error}
                                        </div>
                                    )}

                                    <div className="row g-3">
                                        {/* Name Input */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="form-label">Full Name</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-person-fill"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        className="form-control"
                                                        placeholder="Enter your full name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Input */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="form-label">Email Address</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-envelope-fill"></i>
                                                    </span>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        className="form-control"
                                                        placeholder="Enter your email address"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Password Input */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="form-label">Password</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock-fill"></i>
                                                    </span>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="password"
                                                        className="form-control"
                                                        placeholder="Create a strong password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="input-group-text password-toggle"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                    </button>
                                                </div>

                                                {/* Password Strength Indicator */}
                                                {formData.password && (
                                                    <div className="password-strength mt-2">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <small className="text-muted">Password Strength</small>
                                                            <small className={`text-${getPasswordStrengthColor()} fw-semibold`}>
                                                                {getPasswordStrengthText()}
                                                            </small>
                                                        </div>
                                                        <div className="progress" style={{ height: '4px' }}>
                                                            <div
                                                                className={`progress-bar bg-${getPasswordStrengthColor()}`}
                                                                style={{
                                                                    width: passwordStrength === "strong" ? "100%" :
                                                                        passwordStrength === "medium" ? "66%" :
                                                                            passwordStrength === "weak" ? "33%" : "0%"
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Confirm Password Input */}
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label className="form-label">Confirm Password</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-lock-fill"></i>
                                                    </span>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        className="form-control"
                                                        placeholder="Confirm your password"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="input-group-text password-toggle"
                                                        onClick={toggleConfirmPasswordVisibility}
                                                    >
                                                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                                    </button>
                                                </div>
                                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                                    <small className="text-success mt-1">
                                                        <i className="bi bi-check-circle-fill me-1"></i>
                                                        Passwords match
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="password-requirements mt-3">
                                        <small className="text-muted fw-semibold d-block mb-2">Password Requirements:</small>
                                        <div className="row">
                                            <div className="col-6">
                                                <small className={`d-flex align-items-center ${formData.password.length >= 6 ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${formData.password.length >= 6 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    At least 6 characters
                                                </small>
                                            </div>
                                            <div className="col-6">
                                                <small className={`d-flex align-items-center ${/[A-Z]/.test(formData.password) ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${/[A-Z]/.test(formData.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    One uppercase letter
                                                </small>
                                            </div>
                                            <div className="col-6 mt-1">
                                                <small className={`d-flex align-items-center ${/[0-9]/.test(formData.password) ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${/[0-9]/.test(formData.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    One number
                                                </small>
                                            </div>
                                            <div className="col-6 mt-1">
                                                <small className={`d-flex align-items-center ${/[!@#$%^&*]/.test(formData.password) ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${/[!@#$%^&*]/.test(formData.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    One special character
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terms and Conditions */}
                                    <div className="form-check mt-4">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="terms"
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="terms">
                                            I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                                        </label>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 auth-submit-btn mt-4"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-person-plus-fill me-2"></i>
                                                Create Account
                                            </>
                                        )}
                                    </button>

                                    {/* Login Link */}
                                    <div className="text-center mt-4">
                                        <p className="signup-link">
                                            Already have an account?{" "}
                                            <Link to="/login" className="signup-text">
                                                Sign in here
                                            </Link>
                                        </p>
                                    </div>
                                </form>

                                {/* Security Note */}
                                <div className="security-note text-center mt-4">
                                    <small className="text-muted">
                                        <i className="bi bi-shield-check me-1"></i>
                                        Your data is securely encrypted and protected
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;