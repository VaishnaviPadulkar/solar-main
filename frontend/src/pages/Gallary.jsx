import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Gallary.css";

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        setImages([
            {
                url: "/images/pannel1.avif",
                title: "Solar Panels Array",
                category: "residential",
                description: "High-efficiency solar panels installed on residential rooftops"
            },
            {
                url: "/images/pannel2.avif",
                title: "Rooftop Solar Panels",
                category: "residential",
                description: "Modern solar panel installation for home energy needs"
            },
            {
                url: "/images/pannel3.avif",
                title: "Solar Farm",
                category: "commercial",
                description: "Large-scale solar farm generating clean energy for communities"
            },
            {
                url: "/images/pannel4.avif",
                title: "Solar Innovation",
                category: "innovation",
                description: "Cutting-edge solar technology and innovative installations"
            },
            {
                url: "/images/pannel5.avif",
                title: "Large Solar Farm",
                category: "commercial",
                description: "Expansive solar farm contributing to grid power supply"
            },
            {
                url: "/images/pannel6.avif",
                title: "Sunset Solar",
                category: "residential",
                description: "Beautiful solar panel installation during golden hour"
            },
            {
                url: "/images/pannel7.webp",
                title: "Modern Installation",
                category: "innovation",
                description: "State-of-the-art solar panel system with optimal positioning"
            },
            {
                url: "/images/pannel3.avif",
                title: "Community Solar",
                category: "commercial",
                description: "Community-driven solar project powering neighborhoods"
            },
            {
                url: "/images/pannel4.avif",
                title: "Eco-Friendly Solution",
                category: "innovation",
                description: "Sustainable solar energy solutions for a greener future"
            }
        ]);
    }, []);

    const filteredImages = filter === "all"
        ? images
        : images.filter(img => img.category === filter);

    const openModal = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="gallery-page">
            {/* Hero Section */}
            <section className="gallery-hero">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h1 className="gallery-title">Solar Gallery</h1>
                            <p className="gallery-subtitle">
                                Explore our stunning solar installations and discover the beauty of renewable energy
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="filter-section py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="filter-buttons">
                                <button
                                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                                    onClick={() => setFilter("all")}
                                >
                                    <i className="bi bi-grid-3x3-gap me-2"></i>
                                    All Projects
                                </button>
                                <button
                                    className={`filter-btn ${filter === "residential" ? "active" : ""}`}
                                    onClick={() => setFilter("residential")}
                                >
                                    <i className="bi bi-house me-2"></i>
                                    Residential
                                </button>
                                <button
                                    className={`filter-btn ${filter === "commercial" ? "active" : ""}`}
                                    onClick={() => setFilter("commercial")}
                                >
                                    <i className="bi bi-building me-2"></i>
                                    Commercial
                                </button>
                                <button
                                    className={`filter-btn ${filter === "innovation" ? "active" : ""}`}
                                    onClick={() => setFilter("innovation")}
                                >
                                    <i className="bi bi-lightbulb me-2"></i>
                                    Innovation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="gallery-section py-5">
                <div className="container">
                    <div className="row g-4">
                        {filteredImages.map((img, index) => (
                            <div key={index} className="col-xl-4 col-lg-6 col-md-6">
                                <div
                                    className="gallery-card"
                                    onClick={() => openModal(img)}
                                >
                                    <div className="card-image">
                                        <img
                                            src={img.url}
                                            alt={img.title}
                                            className="img-fluid"
                                        />
                                        <div className="card-overlay">
                                            <div className="overlay-content">
                                                <h5>{img.title}</h5>
                                                <p>{img.description}</p>
                                                <span className="category-badge">{img.category}</span>
                                                <button className="view-btn">
                                                    <i className="bi bi-zoom-in"></i>
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <h5>{img.title}</h5>
                                        <p>{img.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredImages.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-image display-1 text-muted mb-3"></i>
                            <h4 className="text-muted">No projects found</h4>
                            <p className="text-muted">Try selecting a different category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="gallery-cta py-5">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h2 className="cta-title">Ready to Start Your Solar Project?</h2>
                            <p className="cta-subtitle">
                                Join hundreds of satisfied customers who have made the switch to solar energy
                            </p>
                            <div className="cta-buttons">
                                <Link to="/calculator" className="btn btn-primary btn-lg me-3">
                                    <i className="bi bi-calculator me-2"></i>
                                    Calculate Savings
                                </Link>
                                <Link to="/contact" className="btn btn-outline-light btn-lg">
                                    <i className="bi bi-chat-dots me-2"></i>
                                    Get Free Quote
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Modal */}
            {selectedImage && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title text-white">{selectedImage.title}</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body p-0">
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.title}
                                    className="img-fluid w-100"
                                />
                                <div className="image-info p-4">
                                    <p className="text-muted mb-2">{selectedImage.description}</p>
                                    <span className="badge bg-primary">{selectedImage.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;