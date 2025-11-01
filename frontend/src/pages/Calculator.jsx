import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import "./styles/Calculator.css";

const Calculator = () => {
    const [inputs, setInputs] = useState({
        usage: "",
        tariff: "",
        sunlight: "5",
        efficiency: "75",
        customerName: "",
        billDate: ""
    });
    const [result, setResult] = useState(null);
    const [isProcessingPDF, setIsProcessingPDF] = useState(false);
    const [pdfFile, setPdfFile] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [backendError, setBackendError] = useState("");
    const [calculationMode, setCalculationMode] = useState("manual");
    const [calculationDetails, setCalculationDetails] = useState(null);
    const navigate = useNavigate();

    const [pdfData, setPdfData] = useState()
    const API_BASE_URL = "http://localhost:5000/api";

    const testBackendConnection = useCallback(async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(`${API_BASE_URL}/health`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            console.error("Backend connection test failed:", error);
            return false;
        }
    }, [API_BASE_URL]);

    const handleInputChange = (field, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
        setBackendError("");
    };

    // PDF Dropzone for automatic calculation
    // In your Calculator.js component, update the onDrop function:

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const isBackendConnected = await testBackendConnection();
            if (!isBackendConnected) {
                setBackendError("Backend server is not running. Please start the server on port 5000.");
                return;
            }

            setPdfFile(file);
            setIsProcessingPDF(true);
            setBackendError("");
            setCalculationMode("pdf");

            const formData = new FormData();
            formData.append('pdfFile', file);

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 45000); // Increased timeout

                const response = await fetch(`${API_BASE_URL}/calculate/process-pdf-calculate`, {
                    method: "POST",
                    body: formData,
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Server responded with ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setPdfData(data.result)
                    setExtractedData(data.data.extractedData);

                    // Check if we have usage data
                    if (data.data.extractedData.usage) {
                        setResult(data.data.calculation.savings);
                        setCalculationDetails(data.data);

                        // Update inputs with extracted data
                        setInputs(prev => ({
                            ...prev,
                            usage: data.data.calculation.usage.toString(),
                            tariff: data.data.calculation.tariff.toString(),
                            sunlight: data.data.calculation.sunlight.toString(),
                            efficiency: data.data.calculation.efficiency.toString(),
                            customerName: data.data.calculation.customerName || "",
                            billDate: data.data.calculation.billDate ? new Date(data.data.calculation.billDate).toISOString().split('T')[0] : ""
                        }));
                    } else {
                        // No usage data extracted, show manual input mode
                        setBackendError("Could not extract usage data automatically. Please enter the usage manually below.");
                        setCalculationMode("manual");
                        // Still set tariff if available
                        if (data.data.extractedData.tariff) {
                            setInputs(prev => ({
                                ...prev,
                                tariff: data.data.extractedData.tariff.toString()
                            }));
                        }
                    }
                } else {
                    // Handle partial success (got some data but not all)
                    if (data.data && data.data.tariff) {
                        setBackendError(`${data.message} But we found the tariff rate. Please enter usage manually.`);
                        setInputs(prev => ({
                            ...prev,
                            tariff: data.data.tariff.toString()
                        }));
                        setCalculationMode("manual");
                    } else {
                        alert(data.message || "Failed to process PDF");
                        setPdfFile(null);
                        setCalculationMode("manual");
                    }
                }
            } catch (error) {
                console.error("PDF processing error:", error);
                if (error.name === 'AbortError') {
                    setBackendError("PDF processing timeout. The file might be too large or complex.");
                } else {
                    setBackendError(error.message || "PDF processing unavailable. Please enter values manually.");
                }
                setPdfFile(null);
                setCalculationMode("manual");
            } finally {
                setIsProcessingPDF(false);
            }
        }
    }, [testBackendConnection, API_BASE_URL, navigate]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024
    });

    const removePDF = () => {
        setPdfFile(null);
        setExtractedData(null);
        setBackendError("");
        setCalculationMode("manual");
        setResult(null);
        setCalculationDetails(null);
    };

    const handleManualCalculate = async () => {
        if (!inputs.usage || !inputs.tariff) {
            alert("Please fill required fields (Usage and Tariff)!");
            return;
        }

        const isBackendConnected = await testBackendConnection();
        if (!isBackendConnected) {
            setBackendError("Backend server is not running. Please start the server on port 5000.");
            return;
        }

        setIsProcessingPDF(true);
        setBackendError("");

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const payload = {
                usage: parseFloat(inputs.usage),
                tariff: parseFloat(inputs.tariff),
                sunlight: parseFloat(inputs.sunlight),
                efficiency: parseFloat(inputs.efficiency),
                customerName: inputs.customerName,
                billDate: inputs.billDate,
                source: 'manual'
            };

            const response = await fetch(`${API_BASE_URL}/calculate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Server responded with ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setResult(data.data.calculation.savings);
                setCalculationDetails(data.data);
            } else {
                alert("Error calculating savings: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.name === 'AbortError') {
                setBackendError("Request timeout. Please try again.");
            } else {
                setBackendError(error.message || "Failed to save calculation. Please check if backend server is running.");
            }
        } finally {
            setIsProcessingPDF(false);
        }
    };

    const resetCalculator = () => {
        setInputs({
            usage: "",
            tariff: "",
            sunlight: "5",
            efficiency: "75",
            customerName: "",
            billDate: ""
        });
        setResult(null);
        setPdfFile(null);
        setExtractedData(null);
        setBackendError("");
        setCalculationMode("manual");
        setCalculationDetails(null);
    };

    const viewDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div className="calculator-container">
            <div className="container">
                <div className="calculator-header text-center mb-5">
                    <div className="sun-icon">
                        <i className="bi bi-sun-fill"></i>
                    </div>
                    <h1 className="calculator-title">Solar Savings Calculator</h1>
                    <p className="calculator-subtitle">
                        Upload your electricity bill PDF for automatic calculation or enter details manually
                    </p>
                </div>

                {backendError && (
                    <div className="alert alert-warning mb-4">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {backendError}
                        <div className="mt-2">
                            <small>
                                Make sure your backend server is running: <code>npm start</code> in backend directory
                            </small>
                        </div>
                    </div>
                )}

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="calculator-card">
                            <div className="calculator-body">

                                {/* PDF Upload Section for Automatic Calculation */}
                                <div className="pdf-upload-section mb-4">
                                    <h5 className="section-title">
                                        <i className="bi bi-file-earmark-pdf me-2"></i>
                                        Automatic Calculation from PDF Bill
                                    </h5>
                                    <p className="text-muted mb-3">
                                        Upload your electricity bill PDF for automatic data extraction and calculation
                                    </p>

                                    {!pdfFile ? (
                                        <div
                                            {...getRootProps()}
                                            className={`pdf-dropzone ${isDragActive ? 'active' : ''}`}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="dropzone-content">
                                                <i className="bi bi-cloud-arrow-up display-4 text-muted mb-3"></i>
                                                <p className="mb-2">
                                                    {isDragActive ?
                                                        "Drop the PDF here..." :
                                                        "Drag & drop your electricity bill PDF here"
                                                    }
                                                </p>
                                                <small className="text-muted">
                                                    We'll automatically extract usage and tariff data and calculate your savings
                                                </small>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pdf-preview">
                                            <div className="pdf-preview-content">
                                                <i className="bi bi-file-earmark-pdf-fill text-danger me-3"></i>
                                                <div className="file-info">
                                                    <strong>{pdfFile.name}</strong>
                                                    <small className="text-muted d-block">
                                                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </small>
                                                    {extractedData && (
                                                        <div className="extracted-data mt-2">
                                                            <small className="text-success">
                                                                <i className="bi bi-check-circle me-1"></i>
                                                                Extracted: {extractedData.usage} kWh, ₹{extractedData.tariff}/kWh
                                                                {extractedData.customerName && `, ${extractedData.customerName}`}
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-danger ms-auto"
                                                    onClick={removePDF}
                                                    disabled={isProcessingPDF}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            {isProcessingPDF && (
                                                <div className="processing-overlay">
                                                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                                    Processing PDF and Calculating Savings please wait...
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Manual Input Section */}
                                <div className="manual-input-section">

                                    <h5 className="section-title mb-4">
                                        <i className="bi bi-pencil me-2"></i>
                                        {pdfData ? "Extracted Data (Editable)" : "Manual Calculation"}
                                    </h5>

                                    {
                                        pdfData
                                            ? <>

                                                <div className="row g-4">
                                                    <div className="col-md-12">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-person"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Customer Number</label>
                                                                <span>{pdfData.consumerNo}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-person"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Customer Name (Optional)</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter customer name"
                                                                    value={pdfData.name}
                                                                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-calendar"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Bill Date (Optional)</label>
                                                                <span>{pdfData.billDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-lightning-charge"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Monthly Usage *</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Enter kWh"
                                                                    value={pdfData.units}
                                                                    onChange={(e) => handleInputChange('usage', e.target.value)}
                                                                    disabled={calculationMode === "pdf" && isProcessingPDF}
                                                                />
                                                                <span className="input-unit">kWh</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-currency-rupee"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Electricity Rate *</label>
                                                                <span>10.5</span>
                                                                <span className="input-unit">₹/kWh</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-brightness-high"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Daily Sunlight</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    placeholder="Hours per day"
                                                                    value={inputs.sunlight}
                                                                    onChange={(e) => handleInputChange('sunlight', e.target.value)}
                                                                />
                                                                <span className="input-unit">hours</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-graph-up-arrow"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>System Efficiency</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Efficiency percentage"
                                                                    value={inputs.efficiency}
                                                                    onChange={(e) => handleInputChange('efficiency', e.target.value)}
                                                                />
                                                                <span className="input-unit">%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            : <>
                                                <div className="row g-4">
                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-person"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Customer Name (Optional)</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter customer name"
                                                                    value={inputs.customerName}
                                                                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-calendar"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Bill Date (Optional)</label>
                                                                <input
                                                                    type="date"
                                                                    value={inputs.billDate}
                                                                    onChange={(e) => handleInputChange('billDate', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-lightning-charge"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Monthly Usage *</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Enter kWh"
                                                                    value={inputs.usage}
                                                                    onChange={(e) => handleInputChange('usage', e.target.value)}
                                                                    disabled={calculationMode === "pdf" && isProcessingPDF}
                                                                />
                                                                <span className="input-unit">kWh</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-currency-rupee"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Electricity Rate *</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    placeholder="Rate per kWh"
                                                                    value={inputs.tariff}
                                                                    onChange={(e) => handleInputChange('tariff', e.target.value)}
                                                                    disabled={calculationMode === "pdf" && isProcessingPDF}
                                                                />
                                                                <span className="input-unit">₹/kWh</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-brightness-high"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>Daily Sunlight</label>
                                                                <input
                                                                    type="number"
                                                                    step="0.1"
                                                                    placeholder="Hours per day"
                                                                    value={inputs.sunlight}
                                                                    onChange={(e) => handleInputChange('sunlight', e.target.value)}
                                                                />
                                                                <span className="input-unit">hours</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="input-group-custom">
                                                            <div className="input-icon">
                                                                <i className="bi bi-graph-up-arrow"></i>
                                                            </div>
                                                            <div className="input-content">
                                                                <label>System Efficiency</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Efficiency percentage"
                                                                    value={inputs.efficiency}
                                                                    onChange={(e) => handleInputChange('efficiency', e.target.value)}
                                                                />
                                                                <span className="input-unit">%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                    }


                                    <div className="calculator-actions mt-4">
                                        {calculationMode === "manual" && (
                                            <button
                                                className={`calculate-btn ${isProcessingPDF ? 'calculating' : ''}`}
                                                onClick={handleManualCalculate}
                                                disabled={isProcessingPDF}
                                            >
                                                {isProcessingPDF ? (
                                                    <>
                                                        <div className="spinner"></div>
                                                        Calculating & Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-calculator me-2"></i>
                                                        Calculate & Save
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        <button
                                            className="reset-btn"
                                            onClick={resetCalculator}
                                        >
                                            <i className="bi bi-arrow-clockwise me-2"></i>
                                            Reset
                                        </button>

                                        {result && (
                                            <button
                                                className="dashboard-btn"
                                                onClick={viewDashboard}
                                            >
                                                <i className="bi bi-speedometer2 me-2"></i>
                                                View Dashboard
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Results Section */}
                                {result && calculationDetails && (
                                    <div className="result-card mt-4">
                                        <div className="result-icon">
                                            <i className="bi bi-piggy-bank-fill"></i>
                                        </div>
                                        <div className="result-content">
                                            <h3>Your Estimated Savings</h3>
                                            <div className="savings-amount">₹{result}<span>/month</span></div>

                                            <div className="alert alert-success mt-3">
                                                <i className="bi bi-check-circle-fill me-2"></i>
                                                {calculationMode === "pdf" ?
                                                    "PDF processed and calculation saved successfully!" :
                                                    "Calculation saved successfully!"
                                                }
                                            </div>

                                            <div className="savings-breakdown">
                                                <div className="breakdown-item">
                                                    <span>Monthly Electricity Cost</span>
                                                    <strong>₹{calculationDetails.breakdown.monthlyCost}</strong>
                                                </div>
                                                <div className="breakdown-item">
                                                    <span>Monthly Savings</span>
                                                    <strong>₹{calculationDetails.breakdown.monthlySavings}</strong>
                                                </div>
                                                <div className="breakdown-item">
                                                    <span>Yearly Savings</span>
                                                    <strong>₹{calculationDetails.breakdown.yearlySavings}</strong>
                                                </div>
                                                <div className="breakdown-item">
                                                    <span>5-Year Savings</span>
                                                    <strong>₹{(calculationDetails.breakdown.yearlySavings * 5).toLocaleString()}</strong>
                                                </div>
                                            </div>

                                            {calculationMode === "pdf" && extractedData && calculationDetails.assumptions && (
                                                <div className="extracted-info mt-3">
                                                    <h6>Calculation Details:</h6>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <small><strong>Extracted from PDF:</strong></small>
                                                            <div className="mt-1">
                                                                <small>Usage: {extractedData.usage} kWh</small><br />
                                                                <small>Tariff: ₹{extractedData.tariff}/kWh</small>
                                                                {extractedData.customerName && <><br /><small>Customer: {extractedData.customerName}</small></>}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <small><strong>Assumptions:</strong></small>
                                                            <div className="mt-1">
                                                                <small>Sunlight: {calculationDetails.assumptions.sunlight}</small><br />
                                                                <small>Efficiency: {calculationDetails.assumptions.efficiency}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;