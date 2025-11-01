import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDash = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        newUsers: 0
    });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [calculations, setCalculations] = useState([]);


    useEffect(() => {
        fetchUsers();
        fetchCalculations();
    }, []);

    const fetchCalculations = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/calculate`);
            setCalculations(res.data);
        } catch (error) {
            console.error("Error fetching calculations:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data);

            // Calculate stats
            setStats({
                totalUsers: res.data.length,
                activeUsers: res.data.filter(user => user.isActive !== false).length,
                newUsers: res.data.filter(user => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(user.createdAt) > weekAgo;
                }).length
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserModal(true);
    };

    const handleDeleteClick = (user) => {
        setDeleteConfirm(user);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;

        try {
            setActionLoading(true);
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:5000/api/admin/users/${deleteConfirm._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove user from local state
            setUsers(users.filter(user => user._id !== deleteConfirm._id));

            // Update stats
            setStats(prev => ({
                ...prev,
                totalUsers: prev.totalUsers - 1,
                activeUsers: prev.activeUsers - 1,
                newUsers: deleteConfirm.createdAt && new Date(deleteConfirm.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    ? prev.newUsers - 1
                    : prev.newUsers
            }));

            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const closeUserModal = () => {
        setShowUserModal(false);
        setSelectedUser(null);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="admin-content">
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <div className="text-center">
                        <div className="loading-spinner mb-3"></div>
                        <p className="text-muted">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-content fade-in">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold text-dark mb-1">Dashboard Overview</h2>
                            <p className="text-muted mb-0">Welcome back, {localStorage.getItem("adminName")}!</p>
                        </div>
                        <div className="text-end">
                            <div className="text-muted small">Last updated</div>
                            <div className="fw-semibold">{new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-5">
                <div className="col-md-4 mb-4">
                    <div className="stat-card p-4 h-100">
                        <div className="d-flex align-items-center">
                            <div className="stat-icon me-3">
                                <i className="bi bi-people-fill"></i>
                            </div>
                            <div>
                                <h3 className="fw-bold text-primary mb-0">{stats.totalUsers}</h3>
                                <p className="text-muted mb-0">Total Users</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="stat-card p-4 h-100">
                        <div className="d-flex align-items-center">
                            <div className="stat-icon me-3" style={{ background: 'var(--success-gradient)' }}>
                                <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div>
                                <h3 className="fw-bold text-success mb-0">{stats.activeUsers}</h3>
                                <p className="text-muted mb-0">Active Users</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-4">
                    <div className="stat-card p-4 h-100">
                        <div className="d-flex align-items-center">
                            <div className="stat-icon me-3" style={{ background: 'var(--warning-gradient)' }}>
                                <i className="bi bi-graph-up-arrow"></i>
                            </div>
                            <div>
                                <h3 className="fw-bold text-warning mb-0">{stats.newUsers}</h3>
                                <p className="text-muted mb-0">New This Week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="row">
                <div className="col-12">
                    <div className="modern-table">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                        <th>Date Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id} className="fade-in">
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                                        style={{ width: '40px', height: '40px' }}>
                                                        <i className="bi bi-person-fill text-white"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-semibold">{user.name}</div>
                                                        <small className="text-muted">ID: {user._id}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="align-middle">
                                                <span className="text-muted">{user.email}</span>
                                            </td>
                                            <td className="align-middle">
                                                <span className="badge bg-success bg-opacity-10 text-success">
                                                    <i className="bi bi-check-circle me-1"></i>
                                                    Active
                                                </span>
                                            </td>
                                            <td className="align-middle">
                                                <small className="text-muted">
                                                    {formatDate(user.createdAt)}
                                                </small>
                                            </td>
                                            <td className="align-middle">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleViewUser(user)}
                                                    title="View User Details"
                                                >
                                                    <i className="bi bi-eye"></i> View
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteClick(user)}
                                                    title="Delete User"
                                                >
                                                    <i className="bi bi-trash"></i> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {users.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-people display-1 text-muted mb-3"></i>
                            <h4 className="text-muted">No Users Found</h4>
                            <p className="text-muted">There are no registered users in the system yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Calculations Table */}
            <div className="row mt-5">
                <div className="col-12">
                    <h4 className="fw-bold text-dark mb-3">Recent Solar Calculations</h4>
                    <div className="modern-table">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Usage (kWh)</th>
                                        <th>Tariff (₹)</th>
                                        <th>Sunlight (hrs/day)</th>
                                        <th>Efficiency (%)</th>
                                        <th>Savings (₹)</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calculations.length > 0 ? (
                                        calculations.map(calc => (
                                            <tr key={calc._id}>
                                                <td>{calc.usage}</td>
                                                <td>{calc.tariff}</td>
                                                <td>{calc.sunlight}</td>
                                                <td>{calc.efficiency}</td>
                                                <td className="fw-bold text-success">{calc.savings}</td>
                                                <td>{new Date(calc.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted py-4">
                                                No calculations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-person-circle me-2"></i>
                                    User Details
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeUserModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-12 text-center mb-4">
                                        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                                            style={{ width: '80px', height: '80px' }}>
                                            <i className="bi bi-person-fill text-white fs-3"></i>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Full Name</label>
                                        <div className="form-control bg-light">{selectedUser.name}</div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Email</label>
                                        <div className="form-control bg-light">{selectedUser.email}</div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">User ID</label>
                                        <div className="form-control bg-light text-truncate">{selectedUser._id}</div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Status</label>
                                        <div className="form-control bg-light">
                                            <span className="badge bg-success">
                                                <i className="bi bi-check-circle me-1"></i>
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label className="form-label fw-semibold">Registration Date</label>
                                        <div className="form-control bg-light">{formatDate(selectedUser.createdAt)}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeUserModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Confirm Deletion
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <div className="text-center mb-4">
                                    <div className="bg-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{ width: '60px', height: '60px' }}>
                                        <i className="bi bi-trash-fill text-white fs-4"></i>
                                    </div>
                                    <h5 className="text-danger">Are you sure you want to delete this user?</h5>
                                    <p className="text-muted">
                                        This action will permanently delete <strong>{deleteConfirm.name}</strong> ({deleteConfirm.email})
                                        from the system. This action cannot be undone.
                                    </p>
                                </div>
                                <div className="alert alert-warning">
                                    <i className="bi bi-info-circle me-2"></i>
                                    <strong>Warning:</strong> This action is irreversible. All user data will be permanently removed.
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelDelete}
                                    disabled={actionLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-trash-fill me-2"></i>
                                            Delete User
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDash;