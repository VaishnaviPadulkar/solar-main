import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminLogin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/login`,
                // "http://localhost:5000/api/admin/login",
                form,
                {
                    timeout: 10000,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            localStorage.setItem("adminToken", res.data.token);
            localStorage.setItem("adminName", res.data.admin.name);
            localStorage.setItem("adminRole", res.data.admin.role);

            setLoading(false);
            navigate("/admin/dash");
        } catch (err) {
            setLoading(false);
            if (err.code === 'ECONNREFUSED') {
                setError("Cannot connect to server. Please make sure the backend is running.");
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.message.includes('Network Error')) {
                setError("Network error. Please check your connection.");
            } else {
                setError("Login failed. Please try again.");
            }
        }
    };

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="auth-card fade-in">
                        <div className="auth-header">
                            <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                style={{ width: '70px', height: '70px' }}>
                                <i className="bi bi-shield-lock-fill text-primary fs-2"></i>
                            </div>
                            <h3 className="fw-bold mb-2">Admin Login</h3>
                            <p className="mb-0 opacity-75">Access your management dashboard</p>
                        </div>

                        <div className="auth-body">
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center fade-in" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    <div>
                                        {error}
                                        {error.includes("Cannot connect to server") && (
                                            <div className="mt-1">
                                                <small>Ensure backend is running on port 5000</small>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
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
                                            placeholder="Enter your email"
                                            className="form-control form-control-modern border-start-0"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
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
                                            placeholder="Enter your password"
                                            className="form-control form-control-modern border-start-0"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-modern w-100 py-3 fw-semibold"
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

                                <div className="text-center mt-4">
                                    <p className="text-muted mb-0">
                                        Don't have an account?{" "}
                                        <Link to="/admin/register" className="text-primary text-decoration-none fw-semibold">
                                            Create Account
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;