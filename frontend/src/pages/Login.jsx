import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./styles/Login.css";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                email: form.email,
                password: form.password,
            });

            // Store user data in localStorage
            localStorage.setItem("userToken", res.data.token);
            localStorage.setItem("userName", res.data.user.name);

            setMessage("🎉 Login successful! Redirecting...");

            // Redirect to home page after successful login
            setTimeout(() => {
                window.location.href = "/solar";
            }, 2000);

        } catch (err) {
            console.error("Login error:", err);
            setMessage("❌ Invalid email or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                                    <i className="bi bi-sun-fill"></i>
                                </div>
                                <h2>Welcome Back!</h2>
                                <p>Sign in to access your solar energy dashboard and manage your account.</p>

                                {/* Floating Elements */}
                                <div className="floating-element el-1">
                                    <i className="bi bi-lightning-charge-fill"></i>
                                </div>
                                <div className="floating-element el-2">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>
                                <div className="floating-element el-3">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                {/* Features List */}
                                <div className="features-list">
                                    <div className="feature-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Track your energy savings</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Monitor solar performance</span>
                                    </div>
                                    <div className="feature-item">
                                        <i className="bi bi-check-circle-fill"></i>
                                        <span>Access exclusive content</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
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
                                        <i className="bi bi-person-circle"></i>
                                    </div>
                                    <h1 className="auth-title">Welcome Back</h1>
                                    <p className="auth-subtitle">Sign in to your SolarSmart account</p>
                                </div>

                                {/* Login Form */}
                                <form onSubmit={handleLogin} className="auth-form">
                                    {message && (
                                        <div className={`alert ${message.includes('❌') ? 'alert-danger' : 'alert-success'} fade-in`}>
                                            <i className={`bi ${message.includes('❌') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                                            {message}
                                        </div>
                                    )}

                                    {/* Email Input */}
                                    <div className="form-group mb-4">
                                        <label className="form-label">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-envelope-fill"></i>
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Enter your email address"
                                                value={form.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password Input */}
                                    <div className="form-group mb-4">
                                        <label className="form-label">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-lock-fill"></i>
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                className="form-control"
                                                placeholder="Enter your password"
                                                value={form.password}
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
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="rememberMe"
                                            />
                                            <label className="form-check-label" htmlFor="rememberMe">
                                                Remember me
                                            </label>
                                        </div>
                                        <Link to="/forgot-password" className="forgot-password">
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 auth-submit-btn"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Signing In...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Sign In
                                            </>
                                        )}
                                    </button>

                                    {/* Divider */}
                                    <div className="divider my-4">
                                        <span>Or continue with</span>
                                    </div>

                                    {/* Social Login */}
                                    <div className="social-login mb-4">
                                        <button type="button" className="btn btn-outline-secondary w-100 social-btn">
                                            <i className="bi bi-google me-2"></i>
                                            Continue with Google
                                        </button>
                                    </div>

                                    {/* Sign Up Link */}
                                    <div className="text-center">
                                        <p className="signup-link">
                                            Don't have an account?{" "}
                                            <Link to="/register" className="signup-text">
                                                Create account
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

export default Login;