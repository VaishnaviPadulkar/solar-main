import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = ({ allowedRoles = ["admin"] }) => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRole");
        localStorage.removeItem("adminName");
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;