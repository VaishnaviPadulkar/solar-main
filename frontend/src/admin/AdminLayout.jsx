import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Handle responsive sidebar on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="admin-container">
            <AdminNavbar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
            <main className={`admin-main ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="container-fluid p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;