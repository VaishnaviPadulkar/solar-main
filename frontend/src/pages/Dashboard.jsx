import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/Dashboard.css";
import { useCallback } from "react";

const Dashboard = () => {
    const [calculations, setCalculations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [stats, setStats] = useState({
        totalCalculations: 0,
        totalSavings: 0,
        averageSavings: 0,
        yearlySavings: 0
    });

    const API_BASE_URL = "http://localhost:5000/api";

    const fetchCalculations = async () => {
        try {
            setLoading(true);
            console.log("Fetching calculations from:", `${API_BASE_URL}/calculate`);

            const response = await fetch(`${API_BASE_URL}/calculate`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setCalculations(data.data || []);
                await fetchStats();
                setError("");
            } else {
                setError(data.message || "Failed to fetch calculations");
            }
        } catch (error) {
            console.error("Error fetching calculations:", error);
            const errorMessage = error.message.includes("Failed to fetch")
                ? "Backend server is not running. Please start the server on port 5000."
                : `Error: ${error.message}`;
            setError(errorMessage);
            setCalculations([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/calculate/stats`);
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                }
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const testBackendConnection = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            if (response.ok) {
                // Show success feedback
                const alertEl = document.createElement('div');
                alertEl.className = 'alert alert-success alert-floating';
                alertEl.innerHTML = '<i className="bi bi-check-circle me-2"></i>Backend connection successful!';
                document.body.appendChild(alertEl);
                setTimeout(() => alertEl.remove(), 3000);
            }
            return response.ok;
        } catch (error) {
            console.error("Backend connection test failed:", error);
            return false;
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        const initializeDashboard = async () => {
            await fetchCalculations();
        };

        initializeDashboard();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatShortDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const deleteCalculation = async (id) => {
        if (window.confirm("Are you sure you want to delete this calculation?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/calculate/${id}`, {
                    method: "DELETE",
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    setCalculations(calculations.filter(calc => calc._id !== id));
                    await fetchStats();

                    // Show success message
                    const alertEl = document.createElement('div');
                    alertEl.className = 'alert alert-success alert-floating';
                    alertEl.innerHTML = '<i className="bi bi-trash me-2"></i>Calculation deleted successfully!';
                    document.body.appendChild(alertEl);
                    setTimeout(() => alertEl.remove(), 3000);
                } else {
                    alert(data.message || "Failed to delete calculation");
                }
            } catch (error) {
                console.error("Error deleting calculation:", error);
                alert("Error deleting calculation. Check if server is running.");
            }
        }
    };

    const viewCalculationDetails = (calculation) => {
        const isPDF = calculation.source === 'pdf';
        const extractedData = calculation.extractedData || {};

        const details = `
Calculation Details:
===================

BASIC INFORMATION:
• Usage: ${calculation.usage} kWh
• Tariff: ₹${calculation.tariff}/kWh
• Sunlight: ${calculation.sunlight} hours/day
• Efficiency: ${calculation.efficiency}%
• Monthly Cost: ₹${calculation.monthlyCost}
• Monthly Savings: ₹${calculation.savings}
• Yearly Savings: ₹${calculation.yearlySavings}
• Source: ${calculation.source}
• Created: ${formatDate(calculation.createdAt)}
${calculation.customerName ? `• Customer: ${calculation.customerName}` : ''}
${calculation.billDate ? `• Bill Date: ${formatShortDate(calculation.billDate)}` : ''}
${calculation.pdfFileName ? `• PDF File: ${calculation.pdfFileName}` : ''}

${isPDF ? `
OCR EXTRACTION REPORT:
=====================
Extraction Status: ${extractedData.extractedSuccessfully ? '✅ Successful' : '⚠️ Partial/Failed'}
Confidence Level: ${extractedData.ocrConfidence || 'Unknown'}
Extraction Method: ${extractedData.extractionMethod || 'Tesseract OCR'}
Customer Name: ${extractedData.customerName || '❌ Not extracted'}
Bill Date: ${extractedData.billDate ? formatShortDate(extractedData.billDate) : '❌ Not extracted'}

EXTRACTED VALUES:
• Usage: ${extractedData.usage || '❌ Not found'} kWh
• Tariff: ₹${extractedData.tariff || '❌ Not found'}/kWh

RAW TEXT SAMPLE:
${extractedData.rawText ? extractedData.rawText.substring(0, 300) + '...' : 'No text extracted'}
` : ''}
  `;

        alert(details);
    };

    // Add a new function to show detailed OCR information
    const showOCRDetails = (calculation) => {
        if (calculation.source !== 'pdf') return;

        const extractedData = calculation.extractedData || {};

        const ocrDetails = `
📄 PDF OCR EXTRACTION REPORT
============================

File: ${calculation.pdfFileName}
Processing Method: ${extractedData.extractionMethod || 'Tesseract OCR'}
Extraction Date: ${formatDate(calculation.createdAt)}
Confidence Level: ${extractedData.ocrConfidence?.toUpperCase() || 'UNKNOWN'}

📊 EXTRACTION RESULTS:
• Usage: ${extractedData.usage ? `✅ ${extractedData.usage} kWh` : '❌ Not found'}
• Tariff: ${extractedData.tariff ? `✅ ₹${extractedData.tariff}/kWh` : '❌ Not found'}
• Customer Name: ${extractedData.customerName ? `✅ ${extractedData.customerName}` : '❌ Not found'}
• Bill Date: ${extractedData.billDate ? `✅ ${formatShortDate(extractedData.billDate)}` : '❌ Not found'}

🎯 EXTRACTION STATUS: ${extractedData.extractedSuccessfully ? 'SUCCESSFUL' : 'PARTIAL/FAILED'}

${extractedData.rawText ? `
📝 RAW TEXT EXTRACTED (First 500 characters):
----------------------------------------
${extractedData.rawText.substring(0, 500)}${extractedData.rawText.length > 500 ? '...' : ''}
` : 'No text content available'}
  `;

        alert(ocrDetails);
    };

    if (loading) {
        return (
            <div className="dashboard-container">
                <div className="container">
                    <div className="text-center py-5">
                        <div className="solar-loader">
                            <div className="sun"></div>
                            <div className="orbit">
                                <div className="planet"></div>
                            </div>
                        </div>
                        <p className="mt-3 loading-text">Loading solar calculations...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="container">
                {/* Header with Gradient */}
                <div className="dashboard-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <i className="bi bi-sun"></i>
                        </div>
                        <div className="header-text">
                            <h1 className="dashboard-title">
                                Solar Savings Dashboard
                            </h1>
                            <p className="dashboard-subtitle">
                                Harness the power of solar energy savings with OCR technology
                            </p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <div className="savings-preview">
                            <span className="savings-amount">₹{stats.yearlySavings.toLocaleString()}</span>
                            <span className="savings-label">Yearly Savings</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-grid">
                    <Link to="/calculator" className="action-card primary-action">
                        <div className="action-icon">
                            <i className="bi bi-lightning-charge"></i>
                        </div>
                        <div className="action-content">
                            <h4>New Calculation</h4>
                            <p>Create solar savings estimate</p>
                        </div>
                        <div className="action-arrow">
                            <i className="bi bi-arrow-right"></i>
                        </div>
                    </Link>

                    <button
                        className="action-card secondary-action"
                        onClick={fetchCalculations}
                        disabled={loading}
                    >
                        <div className="action-icon">
                            <i className="bi bi-arrow-clockwise"></i>
                        </div>
                        <div className="action-content">
                            <h4>{loading ? "Refreshing..." : "Refresh Data"}</h4>
                            <p>Update calculations</p>
                        </div>
                    </button>

                    <button
                        className="action-card info-action"
                        onClick={testBackendConnection}
                    >
                        <div className="action-icon">
                            <i className="bi bi-plug"></i>
                        </div>
                        <div className="action-content">
                            <h4>Test Connection</h4>
                            <p>Check backend status</p>
                        </div>
                    </button>
                </div>

                {error && (
                    <div className="error-card" role="alert">
                        <div className="error-icon">
                            <i className="bi bi-exclamation-triangle"></i>
                        </div>
                        <div className="error-content">
                            <h5>Connection Error</h5>
                            <p>{error}</p>
                            <div className="error-help">
                                <small>
                                    Make sure your backend server is running on port 5000.
                                    Run: <code>cd backend && npm start</code>
                                </small>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                {!error && calculations.length > 0 && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-background total-calculations-bg"></div>
                            <div className="stat-icon">
                                <i className="bi bi-calculator"></i>
                            </div>
                            <div className="stat-content">
                                <h3>{stats.totalCalculations}</h3>
                                <p>Total Calculations</p>
                                <div className="stat-trend">
                                    <i className="bi bi-activity"></i>
                                    <span>All time</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-background total-savings-bg"></div>
                            <div className="stat-icon">
                                <i className="bi bi-currency-rupee"></i>
                            </div>
                            <div className="stat-content">
                                <h3>₹{stats.totalSavings.toLocaleString()}</h3>
                                <p>Total Monthly Savings</p>
                                <div className="stat-trend">
                                    <i className="bi bi-graph-up-arrow"></i>
                                    <span>Monthly</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-background avg-savings-bg"></div>
                            <div className="stat-icon">
                                <i className="bi bi-graph-up"></i>
                            </div>
                            <div className="stat-content">
                                <h3>₹{stats.averageSavings.toLocaleString()}</h3>
                                <p>Average Monthly Savings</p>
                                <div className="stat-trend">
                                    <i className="bi bi-lightning"></i>
                                    <span>Per calculation</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-background yearly-savings-bg"></div>
                            <div className="stat-icon">
                                <i className="bi bi-calendar-check"></i>
                            </div>
                            <div className="stat-content">
                                <h3>₹{stats.yearlySavings.toLocaleString()}</h3>
                                <p>Total Yearly Savings</p>
                                <div className="stat-trend">
                                    <i className="bi bi-star"></i>
                                    <span>Annual projection</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calculations Table */}
                <div className="calculations-section">
                    <div className="section-header">
                        <div className="section-title">
                            <h3>Solar Calculations</h3>
                            <span className="badge-count">{calculations.length}</span>
                        </div>
                        <div className="section-filters">
                            <div className="source-stats">
                                <span className="source-badge pdf">
                                    <i className="bi bi-file-earmark-pdf"></i>
                                    {calculations.filter(c => c.source === 'pdf').length} PDF
                                </span>
                                <span className="source-badge manual">
                                    <i className="bi bi-pencil"></i>
                                    {calculations.filter(c => c.source === 'manual').length} Manual
                                </span>
                            </div>
                            <button
                                className="refresh-btn"
                                onClick={fetchCalculations}
                                disabled={loading}
                            >
                                <i className="bi bi-arrow-clockwise"></i>
                                Refresh
                            </button>
                        </div>
                    </div>

                    {calculations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <i className="bi bi-sun"></i>
                            </div>
                            <h4>
                                {error ? "Cannot load calculations" : "No solar calculations yet"}
                            </h4>
                            <p>
                                {error
                                    ? "Please start the backend server to view calculations"
                                    : "Start harnessing solar savings with your first calculation"
                                }
                            </p>
                            <Link to="/calculator" className="btn btn-primary">
                                <i className="bi bi-lightning-charge me-2"></i>
                                Create First Calculation
                            </Link>
                        </div>
                    ) : (
                        <div className="table-container">
                            <div className="table-responsive">
                                <table className="calculations-table">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Customer</th>
                                            <th>Source</th>
                                            <th>OCR Confidence</th>
                                            <th>Usage</th>
                                            <th>Tariff</th>
                                            <th>Sunlight</th>
                                            <th>Efficiency</th>
                                            <th>Monthly Cost</th>
                                            <th>Monthly Savings</th>
                                            <th>Yearly Savings</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {calculations.map((calc, index) => (
                                            <tr key={calc._id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                                <td>
                                                    <div className="date-cell">
                                                        <div className="date-main">{formatDate(calc.createdAt).split(',')[0]}</div>
                                                        <div className="date-time">{formatDate(calc.createdAt).split(',')[1]}</div>
                                                        {calc.billDate && (
                                                            <div className="bill-date">
                                                                <small>Bill: {formatShortDate(calc.billDate)}</small>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {calc.customerName ? (
                                                        <div className="customer-cell">
                                                            <div className="customer-avatar">
                                                                {calc.customerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                            </div>
                                                            <div className="customer-name">{calc.customerName}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`source-indicator ${calc.source}`}>
                                                        <i className={`bi ${calc.source === 'pdf' ? 'bi-file-earmark-pdf' : 'bi-pencil'}`}></i>
                                                        {calc.source === 'pdf' ? 'PDF' : 'Manual'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="ocr-status">
                                                        {calc.source === 'pdf' ? (
                                                            <>
                                                                <span className={`ocr-badge ${calc.extractedData?.ocrConfidence || 'unknown'}`}>
                                                                    {calc.extractedData?.ocrConfidence || 'unknown'}
                                                                </span>
                                                                <button
                                                                    className="btn-ocr-details"
                                                                    onClick={() => showOCRDetails(calc)}
                                                                    title="View OCR details"
                                                                >
                                                                    <i className="bi bi-search"></i>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="ocr-badge manual">N/A</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="usage-cell">
                                                        {calc.usage} kWh
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="tariff-cell">
                                                        ₹{calc.tariff}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="sunlight-cell">
                                                        <i className="bi bi-brightness-high"></i>
                                                        {calc.sunlight} hrs
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="efficiency-meter">
                                                        <div className="efficiency-fill" style={{ width: `${calc.efficiency}%` }}></div>
                                                        <span>{calc.efficiency}%</span>
                                                    </div>
                                                </td>
                                                <td className="cost-cell">
                                                    <div className="amount negative">
                                                        ₹{calc.monthlyCost.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="savings-cell">
                                                    <div className="amount positive">
                                                        ₹{calc.savings.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="savings-cell">
                                                    <div className="amount positive yearly">
                                                        ₹{calc.yearlySavings.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-action view"
                                                            onClick={() => viewCalculationDetails(calc)}
                                                            title="View details"
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                        <button
                                                            className="btn-action delete"
                                                            onClick={() => deleteCalculation(calc._id)}
                                                            title="Delete calculation"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                {calculations.length > 0 && (
                    <div className="summary-section">
                        <h5>Solar Performance Summary</h5>
                        <div className="summary-grid">
                            <div className="summary-card">
                                <h6>Calculation Overview</h6>
                                <div className="summary-stats">
                                    <div className="summary-item">
                                        <span>Total Calculations</span>
                                        <strong>{stats.totalCalculations}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>PDF Calculations</span>
                                        <strong>{calculations.filter(c => c.source === 'pdf').length}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Manual Calculations</span>
                                        <strong>{calculations.filter(c => c.source === 'manual').length}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="summary-card">
                                <h6>Savings Overview</h6>
                                <div className="summary-stats">
                                    <div className="summary-item">
                                        <span>Total Monthly Savings</span>
                                        <strong>₹{stats.totalSavings.toLocaleString()}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Average Monthly Savings</span>
                                        <strong>₹{stats.averageSavings.toLocaleString()}</strong>
                                    </div>
                                    <div className="summary-item">
                                        <span>Total Yearly Savings</span>
                                        <strong>₹{stats.yearlySavings.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;