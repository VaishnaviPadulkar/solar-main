import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

function AdminRegister() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Check password strength
        if (name === "password") {
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
        } else {
            setPasswordStrength("weak");
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
        setError("");
        setSuccess("");

        // Validation
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/register`,
                // "http://localhost:5000/api/admin/register",
                {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                },
                {
                    timeout: 10000,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            setSuccess(res.data.message);
            setLoading(false);

            // Redirect to login after 2 seconds
            setTimeout(() => navigate("/admin/login"), 2000);
        } catch (err) {
            setLoading(false);
            if (err.code === 'ECONNREFUSED') {
                setError("Cannot connect to server. Please make sure the backend is running.");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message.includes('Network Error')) {
                setError("Network error. Please check your connection.");
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div className="auth-card fade-in">
                        <div className="auth-header position-relative">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-person-plus-fill text-primary fs-2"></i>
                            </div>
                            <h3 className="fw-bold mb-2">Create Admin Account</h3>
                            <p className="mb-0 opacity-75">Join the management team</p>

                            {/* Decorative elements */}
                            <div className="position-absolute top-0 end-0 mt-3 me-4">
                                <div className="spinner-grow spinner-grow-sm text-white-50" style={{ animation: 'pulse 2s infinite' }}></div>
                            </div>
                        </div>

                        <div className="auth-body">
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center fade-in" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div className="flex-grow-1">
                                        {error}
                                        {error.includes("Cannot connect to server") && (
                                            <div className="mt-1">
                                                <small className="opacity-75">Ensure backend is running on port 5000</small>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError("")}
                                    ></button>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success d-flex align-items-center fade-in" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    <div className="flex-grow-1">
                                        {success}
                                        <div className="mt-1">
                                            <small className="opacity-75">Redirecting to login page...</small>
                                        </div>
                                    </div>
                                    <div className="spinner-border spinner-border-sm text-success" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12 mb-4">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-person text-muted"></i>
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                                className="form-control form-control-modern border-start-0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 mb-4">
                                        <label className="form-label fw-semibold">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-envelope text-muted"></i>
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email address"
                                                className="form-control form-control-modern border-start-0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6 mb-4">
                                        <label className="form-label fw-semibold">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-lock text-muted"></i>
                                            </span>
                                            <input
                                                type="password"
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                placeholder="Create password"
                                                className="form-control form-control-modern border-start-0"
                                                required
                                            />
                                        </div>
                                        {form.password && (
                                            <div className="mt-2">
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

                                    <div className="col-12 col-md-6 mb-4">
                                        <label className="form-label fw-semibold">Confirm Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-lock-fill text-muted"></i>
                                            </span>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm password"
                                                className="form-control form-control-modern border-start-0"
                                                required
                                            />
                                        </div>
                                        {form.confirmPassword && form.password === form.confirmPassword && (
                                            <small className="text-success mt-1">
                                                <i className="bi bi-check-circle-fill me-1"></i>
                                                Passwords match
                                            </small>
                                        )}
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="card border-0 bg-light mb-4">
                                    <div className="card-body p-3">
                                        <small className="text-muted fw-semibold">Password Requirements:</small>
                                        <div className="row mt-2">
                                            <div className="col-6">
                                                <small className={`d-flex align-items-center ${form.password.length >= 6 ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${form.password.length >= 6 ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    At least 6 characters
                                                </small>
                                            </div>
                                            <div className="col-6">
                                                <small className={`d-flex align-items-center ${/[A-Z]/.test(form.password) ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${/[A-Z]/.test(form.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    One uppercase letter
                                                </small>
                                            </div>
                                            <div className="col-6 mt-1">
                                                <small className={`d-flex align-items-center ${/[0-9]/.test(form.password) ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${/[0-9]/.test(form.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    One number
                                                </small>
                                            </div>
                                            <div className="col-6 mt-1">
                                                <small className={`d-flex align-items-center ${/[!@#$%^&*]/.test(form.password) ? 'text-success' : 'text-muted'}`}>
                                                    <i className={`bi ${/[!@#$%^&*]/.test(form.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
                                                    One special character
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-modern w-100 py-3 fw-semibold mb-4"
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
                                            Create Admin Account
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <p className="text-muted mb-0">
                                        Already have an account?{" "}
                                        <Link to="/admin/login" className="text-primary text-decoration-none fw-semibold">
                                            Sign In Here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Security Note */}
                    <div className="text-center mt-4">
                        <small className="text-muted">
                            <i className="bi bi-shield-check me-1"></i>
                            Your data is secured with enterprise-grade encryption
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminRegister;