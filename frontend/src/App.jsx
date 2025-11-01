import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import About from './pages/About';
import Calculator from './pages/Calculator';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import AdminLayout from './admin/AdminLayout';
import AdminDash from './admin/AdminDash';
import AdminLogin from './admin/AdminLogin';
import AdminRegister from './admin/AdminRegister';
import Gallery from './pages/Gallary';
import Contact from './pages/Contact';
import './admin/styles/AdminStyles.css';
import Dashboard from './pages/Dashboard';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/gallary' element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Redirect /admin to /admin/dash */}
        <Route path="/admin" element={<Navigate to="/admin/dash" replace />} />

        {/* Admin public routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Protected admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dash" element={<AdminDash />} />
            <Route path="/admin/users" element={<AdminDash />} />
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;