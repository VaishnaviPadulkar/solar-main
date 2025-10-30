import { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "./styles/Contact.css"

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/add/contact`, form);
            // console.log(data);

            setMsg("🎉 Message sent successfully! We'll get back to you soon.");
            setForm({
                name: "",
                email: "",
                phone: "",
                message: ""
            });
        } catch (error) {
            console.error(error);
            setMsg("❌ Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Office locations for markers
    const offices = [
        { position: [18.5204, 73.8567], name: "Pune Office", address: "Pune, Maharashtra" },
        { position: [19.0760, 72.8777], name: "Mumbai Office", address: "Mumbai, Maharashtra" },
        { position: [12.9716, 77.5946], name: "Bangalore Office", address: "Bangalore, Karnataka" },
        { position: [28.6139, 77.2090], name: "Delhi Office", address: "New Delhi" }
    ];

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h1 className="contact-title">Get In Touch</h1>
                            <p className="contact-subtitle">
                                Ready to harness the power of solar energy? Contact us for a free consultation
                                and discover how much you can save.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section py-5">
                <div className="container">
                    <div className="row g-5">
                        {/* Contact Information */}
                        <div className="col-lg-4">
                            <div className="contact-info-card">
                                <h3 className="info-title">Contact Information</h3>
                                <p className="info-subtitle">
                                    Get in touch with our solar experts. We're here to help you
                                    make the switch to clean energy.
                                </p>

                                <div className="contact-methods">
                                    <div className="contact-method">
                                        <div className="method-icon">
                                            <i className="bi bi-telephone-fill"></i>
                                        </div>
                                        <div className="method-content">
                                            <h5>Call Us</h5>
                                            <p>+91 98765 43210</p>
                                            <small>Mon-Sun, 8AM-8PM</small>
                                        </div>
                                    </div>

                                    <div className="contact-method">
                                        <div className="method-icon">
                                            <i className="bi bi-envelope-fill"></i>
                                        </div>
                                        <div className="method-content">
                                            <h5>Email Us</h5>
                                            <p>info@solarsmart.com</p>
                                            <small>We reply within 24 hours</small>
                                        </div>
                                    </div>

                                    <div className="contact-method">
                                        <div className="method-icon">
                                            <i className="bi bi-geo-alt-fill"></i>
                                        </div>
                                        <div className="method-content">
                                            <h5>Visit Us</h5>
                                            <p>Pune, Maharashtra</p>
                                            <small>India - 411001</small>
                                        </div>
                                    </div>

                                    <div className="contact-method">
                                        <div className="method-icon">
                                            <i className="bi bi-clock-fill"></i>
                                        </div>
                                        <div className="method-content">
                                            <h5>Business Hours</h5>
                                            <p>Monday - Sunday</p>
                                            <small>24/7 Customer Support</small>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="social-links-section">
                                    <h6>Follow Us</h6>
                                    <div className="social-links">
                                        <a href="#" className="social-link">
                                            <i className="bi bi-facebook"></i>
                                        </a>
                                        <a href="#" className="social-link">
                                            <i className="bi bi-twitter"></i>
                                        </a>
                                        <a href="#" className="social-link">
                                            <i className="bi bi-instagram"></i>
                                        </a>
                                        <a href="#" className="social-link">
                                            <i className="bi bi-linkedin"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form & Map */}
                        <div className="col-lg-8">
                            <div className="row g-4">
                                {/* Contact Form */}
                                <div className="col-12">
                                    <div className="contact-form-card">
                                        <div className="card-header">
                                            <h3 className="form-title">
                                                <i className="bi bi-chat-dots-fill me-2"></i>
                                                Send us a Message
                                            </h3>
                                            <p className="form-subtitle">
                                                Fill out the form below and our team will contact you within 24 hours.
                                            </p>
                                        </div>

                                        <div className="card-body">
                                            {msg && (
                                                <div className={`alert ${msg.includes('❌') ? 'alert-danger' : 'alert-success'} fade-in`}>
                                                    <i className={`bi ${msg.includes('❌') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                                                    {msg}
                                                </div>
                                            )}

                                            <form onSubmit={handleSubmit}>
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Full Name *</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">
                                                                    <i className="bi bi-person-fill"></i>
                                                                </span>
                                                                <input
                                                                    name="name"
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter your full name"
                                                                    value={form.name}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="form-label">Email Address *</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">
                                                                    <i className="bi bi-envelope-fill"></i>
                                                                </span>
                                                                <input
                                                                    name="email"
                                                                    type="email"
                                                                    className="form-control"
                                                                    placeholder="Enter your email"
                                                                    value={form.email}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label className="form-label">Phone Number</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text">
                                                                    <i className="bi bi-telephone-fill"></i>
                                                                </span>
                                                                <input
                                                                    name="phone"
                                                                    type="tel"
                                                                    className="form-control"
                                                                    placeholder="Enter your phone number"
                                                                    value={form.phone}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <div className="form-group">
                                                            <label className="form-label">Your Message *</label>
                                                            <div className="input-group">
                                                                <span className="input-group-text align-items-start pt-3">
                                                                    <i className="bi bi-chat-left-text-fill"></i>
                                                                </span>
                                                                <textarea
                                                                    name="message"
                                                                    className="form-control"
                                                                    rows="5"
                                                                    placeholder="Tell us about your solar energy needs..."
                                                                    value={form.message}
                                                                    onChange={handleChange}
                                                                    required
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-12">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary btn-lg w-100 submit-btn"
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                    Sending Message...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="bi bi-send-fill me-2"></i>
                                                                    Send Message
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                {/* Map */}
                                <div className="col-12">
                                    <div className="map-card">
                                        <div className="card-header">
                                            <h4 className="map-title">
                                                <i className="bi bi-geo-alt-fill me-2"></i>
                                                Our Offices Across India
                                            </h4>
                                            <p className="map-subtitle">
                                                Visit any of our offices for a free solar consultation
                                            </p>
                                        </div>
                                        <div className="map-container">
                                            <MapContainer
                                                center={[20.5937, 78.9629]}
                                                zoom={5}
                                                style={{ height: "300px", width: "100%" }}
                                                scrollWheelZoom={false}
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                {offices.map((office, index) => (
                                                    <Marker key={index} position={office.position}>
                                                        <Popup>
                                                            <div className="map-popup">
                                                                <h6>{office.name}</h6>
                                                                <p className="mb-1">{office.address}</p>
                                                                <small className="text-muted">
                                                                    <i className="bi bi-telephone me-1"></i>
                                                                    +91 98765 43210
                                                                </small>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                ))}
                                            </MapContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;