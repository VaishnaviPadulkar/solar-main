import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AdminNavbar({ collapsed, onToggle }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminRole");
        navigate("/admin/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        { path: "/admin/dash", icon: "bi-speedometer2", label: "Dashboard" },
        { path: "/admin/users", icon: "bi-people", label: "Users" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {!collapsed && (
                <div
                    className="sidebar-overlay show d-md-none"
                    onClick={onToggle}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`admin-sidebar position-fixed vh-100 ${collapsed ? 'collapsed' : ''}`}
                style={{ width: collapsed ? '80px' : '280px', zIndex: 1050 }}>

                {/* Brand Section */}
                <div className="sidebar-brand p-4 text-center">
                    {!collapsed ? (
                        <div className="fade-in">
                            <h3 className="fw-bold mb-0 text-white">
                                <i className="bi bi-lightning-charge-fill me-2"></i>
                                SolarAdmin
                            </h3>
                            <small className="text-white-50">Management Panel</small>
                        </div>
                    ) : (
                        <h4 className="text-white mb-0">
                            <i className="bi bi-lightning-charge-fill"></i>
                        </h4>
                    )}
                </div>

                {/* User Info */}
                {!collapsed && (
                    <div className="px-4 py-3 text-center fade-in">
                        <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                            style={{ width: '60px', height: '60px' }}>
                            <i className="bi bi-person-fill text-primary fs-4"></i>
                        </div>
                        <h6 className="text-white mb-1">{localStorage.getItem("adminName") || "Admin"}</h6>
                        <small className="text-white-50">Administrator</small>
                    </div>
                )}

                {/* Navigation Menu */}
                <nav className="mt-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-item nav-link text-white d-flex align-items-center py-3 ${isActive(item.path) ? 'active' : ''
                                }`}
                            onClick={() => window.innerWidth < 768 && onToggle()}
                        >
                            <i className={`${item.icon} ${collapsed ? 'mx-auto' : 'me-3'}`} style={{ fontSize: '1.2em' }}></i>
                            {!collapsed && <span className="fw-medium">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="position-absolute bottom-0 start-0 end-0 p-3">
                    <button
                        className={`sidebar-item nav-link text-white d-flex align-items-center py-3 w-100 border-0 bg-transparent ${collapsed ? 'justify-content-center' : ''
                            }`}
                        onClick={handleLogout}
                    >
                        <i className={`bi bi-box-arrow-right ${collapsed ? '' : 'me-3'}`}></i>
                        {!collapsed && <span className="fw-medium">Logout</span>}
                    </button>
                </div>

                {/* Toggle Button */}
                <button
                    className="btn btn-light btn-sm position-absolute rounded-circle d-none d-md-flex"
                    style={{
                        top: '20px',
                        right: '-12px',
                        width: '24px',
                        height: '24px',
                        zIndex: 1060
                    }}
                    onClick={onToggle}
                >
                    <i className={`bi bi-chevron-left ${collapsed ? 'rotate-180' : ''}`}
                        style={{ transition: 'transform 0.3s ease' }}></i>
                </button>
            </div>

            {/* Mobile Top Bar */}
            <nav className="navbar navbar-dark bg-primary d-md-none">
                <div className="container-fluid">
                    <button className="navbar-toggler border-0" type="button" onClick={onToggle}>
                        <i className="bi bi-list"></i>
                    </button>
                    <span className="navbar-brand mb-0 h6">
                        <i className="bi bi-lightning-charge-fill me-2"></i>
                        Admin Panel
                    </span>
                </div>
            </nav>
        </>
    );
}

export default AdminNavbar;