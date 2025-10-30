import { useState } from "react";
import "./styles/Calculator.css";

const Calculator = () => {
    const [inputs, setInputs] = useState({
        usage: "",
        tariff: "",
        sunlight: "",
        efficiency: ""
    });
    const [result, setResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleInputChange = (field, value) => {
        setInputs(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCalculate = () => {
        if (!inputs.usage || !inputs.tariff || !inputs.sunlight || !inputs.efficiency) {
            alert("Please fill all fields!");
            return;
        }

        setIsCalculating(true);

        // Simulate calculation delay for better UX
        setTimeout(() => {
            const monthly = inputs.usage * inputs.tariff * 30;
            const savings = (monthly * (inputs.efficiency / 100)) / inputs.sunlight;
            setResult(savings.toFixed(2));
            setIsCalculating(false);
        }, 1000);
    };

    const resetCalculator = () => {
        setInputs({
            usage: "",
            tariff: "",
            sunlight: "",
            efficiency: ""
        });
        setResult(null);
    };

    return (
        <div className="calculator-container">
            <div className="container">
                <div className="calculator-header text-center mb-5">
                    <div className="sun-icon">
                        <i className="bi bi-sun-fill"></i>
                    </div>
                    <h1 className="calculator-title">Solar Savings Calculator</h1>
                    <p className="calculator-subtitle">Discover how much you can save with solar energy</p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="calculator-card">
                            <div className="calculator-body">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="input-group-custom">
                                            <div className="input-icon">
                                                <i className="bi bi-lightning-charge"></i>
                                            </div>
                                            <div className="input-content">
                                                <label>Monthly Usage</label>
                                                <input
                                                    type="number"
                                                    placeholder="Enter kWh"
                                                    value={inputs.usage}
                                                    onChange={(e) => handleInputChange('usage', e.target.value)}
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
                                                <label>Electricity Rate</label>
                                                <input
                                                    type="number"
                                                    placeholder="Rate per kWh"
                                                    value={inputs.tariff}
                                                    onChange={(e) => handleInputChange('tariff', e.target.value)}
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

                                <div className="calculator-actions">
                                    <button
                                        className={`calculate-btn ${isCalculating ? 'calculating' : ''}`}
                                        onClick={handleCalculate}
                                        disabled={isCalculating}
                                    >
                                        {isCalculating ? (
                                            <>
                                                <div className="spinner"></div>
                                                Calculating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-calculator me-2"></i>
                                                Calculate Savings
                                            </>
                                        )}
                                    </button>

                                    <button
                                        className="reset-btn"
                                        onClick={resetCalculator}
                                    >
                                        <i className="bi bi-arrow-clockwise me-2"></i>
                                        Reset
                                    </button>
                                </div>

                                {result && (
                                    <div className="result-card">
                                        <div className="result-icon">
                                            <i className="bi bi-piggy-bank-fill"></i>
                                        </div>
                                        <div className="result-content">
                                            <h3>Your Estimated Savings</h3>
                                            <div className="savings-amount">₹{result}<span>/month</span></div>
                                            <div className="savings-breakdown">
                                                <div className="breakdown-item">
                                                    <span>Yearly Savings</span>
                                                    <strong>₹{(result * 12).toLocaleString()}</strong>
                                                </div>
                                                <div className="breakdown-item">
                                                    <span>5-Year Savings</span>
                                                    <strong>₹{(result * 60).toLocaleString()}</strong>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="features-grid">
                            <div className="feature-item">
                                <i className="bi bi-shield-check"></i>
                                <h4>Accurate Estimates</h4>
                                <p>Based on real solar performance data</p>
                            </div>
                            <div className="feature-item">
                                <i className="bi bi-tree"></i>
                                <h4>Eco-Friendly</h4>
                                <p>Reduce your carbon footprint</p>
                            </div>
                            <div className="feature-item">
                                <i className="bi bi-graph-up"></i>
                                <h4>Long-Term Savings</h4>
                                <p>Save money for years to come</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;