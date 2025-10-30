import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [contacts, setContacts] = useState([]);
    const navigate = useNavigate();

    // ✅ Fetch all contacts
    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            const res = await axios.get("http://localhost:5000/api/contact", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContacts(res.data);
        } catch (error) {
            console.error(error);
            alert("Failed to load contacts. Please log in again.");
            navigate("/login");
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    // ✅ Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
                <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title mb-4">Contact Submissions</h5>

                    {contacts.length === 0 ? (
                        <p className="text-center text-muted">No contact messages found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Message</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {contacts.map((contact, index) => (
                                        <tr key={contact._id}>
                                            <td>{index + 1}</td>
                                            <td>{contact.name}</td>
                                            <td>{contact.email}</td>
                                            <td>{contact.phone}</td>
                                            <td>{contact.message}</td>
                                            <td>{new Date(contact.date).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

