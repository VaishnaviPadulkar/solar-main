import Calculation from "../models/Calculate.js";
// import { processPDF } from "./pdfController.js";
import fs from 'fs'
import path from 'path'
/**
 * Create new calculation (manual input)
 * @route POST /api/calculate
 * @access Public
 */
export const createCalculation = async (req, res) => {
    try {
        const { usage, tariff, sunlight = 5, efficiency = 75, source = 'manual', customerName, billDate } = req.body;

        // Validate required fields
        if (!usage || !tariff) {
            return res.status(400).json({
                success: false,
                message: "Usage and tariff are required fields"
            });
        }

        // Calculate savings
        const monthlyCost = parseFloat(usage) * parseFloat(tariff);
        const savings = (monthlyCost * (parseFloat(efficiency) / 100)) * (30 / parseFloat(sunlight));
        const yearlySavings = savings * 12;

        // Create calculation record
        const calculation = await Calculation.create({
            usage: parseFloat(usage),
            tariff: parseFloat(tariff),
            sunlight: parseFloat(sunlight),
            efficiency: parseFloat(efficiency),
            savings: parseFloat(savings.toFixed(2)),
            monthlyCost: parseFloat(monthlyCost.toFixed(2)),
            yearlySavings: parseFloat(yearlySavings.toFixed(2)),
            source: source,
            customerName: customerName || '',
            billDate: billDate || null
        });

        console.log("Manual calculation saved successfully");

        res.status(201).json({
            success: true,
            message: "Calculation saved successfully",
            data: {
                calculation: calculation,
                breakdown: {
                    monthlyCost: monthlyCost.toFixed(2),
                    monthlySavings: savings.toFixed(2),
                    yearlySavings: yearlySavings.toFixed(2)
                }
            }
        });

    } catch (error) {
        console.error("Calculation creation error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating calculation: " + error.message
        });
    }
};

/**
 * Process PDF and automatically calculate savings
 * @route POST /api/calculate/process-pdf-calculate
 * @access Public
 */
export const processPDFAndCalculate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No PDF file uploaded"
            });
        }

        console.log("Processing PDF for automatic calculation:", req.file.originalname);

        // Process PDF to extract data
        const pdfResult = await processPDF(req.file.buffer);

        if (!pdfResult.success) {
            return res.status(400).json(pdfResult);
        }

        const extractedData = pdfResult.data;

        // Use extracted data or default values
        const sunlight = extractedData.sunlight || 5;
        const efficiency = extractedData.efficiency || 75;

        // Validate extracted data
        if (!extractedData.usage || !extractedData.tariff) {
            return res.status(400).json({
                success: false,
                message: "Could not extract required data from PDF",
                extractedData: extractedData
            });
        }

        // Perform calculation
        const monthlyCost = extractedData.usage * extractedData.tariff;
        const savings = (monthlyCost * (efficiency / 100)) * (30 / sunlight);
        const yearlySavings = savings * 12;

        // Create calculation record
        const calculation = await Calculation.create({
            usage: parseFloat(extractedData.usage),
            tariff: parseFloat(extractedData.tariff),
            sunlight: sunlight,
            efficiency: efficiency,
            savings: parseFloat(savings.toFixed(2)),
            monthlyCost: parseFloat(monthlyCost.toFixed(2)),
            yearlySavings: parseFloat(yearlySavings.toFixed(2)),
            source: 'pdf',
            pdfFileName: req.file.originalname,
            extractedData: extractedData,
            customerName: extractedData.customerName || '',
            billDate: extractedData.billDate || null
        });

        console.log("PDF calculation saved successfully");

        res.status(201).json({
            success: true,
            message: "PDF processed and calculation saved successfully",
            data: {
                calculation: calculation,
                extractedData: extractedData,
                breakdown: {
                    monthlyCost: monthlyCost.toFixed(2),
                    monthlySavings: savings.toFixed(2),
                    yearlySavings: yearlySavings.toFixed(2)
                },
                assumptions: {
                    sunlight: `${sunlight} hours/day`,
                    efficiency: `${efficiency}%`,
                    note: extractedData.sunlight ? "Used values from PDF" : "Used average values for sunlight and efficiency"
                }
            }
        });

    } catch (error) {
        console.error("PDF calculation error:", error);
        res.status(500).json({
            success: false,
            message: "Error processing PDF and calculating savings: " + error.message
        });
    }
};

/**
 * Get all calculations
 * @route GET /api/calculate
 * @access Public
 */
export const getCalculations = async (req, res) => {
    try {
        const calculations = await Calculation.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Calculations retrieved successfully",
            data: calculations,
            count: calculations.length
        });

    } catch (error) {
        console.error("Get calculations error:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving calculations: " + error.message
        });
    }
};

/**
 * Get calculation statistics
 * @route GET /api/calculate/stats
 * @access Public
 */
export const getCalculationStats = async (req, res) => {
    try {
        const calculations = await Calculation.find();

        const totalCalculations = calculations.length;
        const totalSavings = calculations.reduce((sum, calc) => sum + calc.savings, 0);
        const averageSavings = totalCalculations > 0 ? totalSavings / totalCalculations : 0;
        const yearlySavings = calculations.reduce((sum, calc) => sum + calc.yearlySavings, 0);

        res.status(200).json({
            success: true,
            message: "Statistics retrieved successfully",
            data: {
                totalCalculations,
                totalSavings: parseFloat(totalSavings.toFixed(2)),
                averageSavings: parseFloat(averageSavings.toFixed(2)),
                yearlySavings: parseFloat(yearlySavings.toFixed(2))
            }
        });

    } catch (error) {
        console.error("Get stats error:", error);
        res.status(500).json({
            success: false,
            message: "Error retrieving statistics: " + error.message
        });
    }
};

/**
 * Delete calculation
 * @route DELETE /api/calculate/:id
 * @access Public
 */
export const deleteCalculation = async (req, res) => {
    try {
        const { id } = req.params;

        const calculation = await Calculation.findByIdAndDelete(id);

        if (!calculation) {
            return res.status(404).json({
                success: false,
                message: "Calculation not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Calculation deleted successfully"
        });

    } catch (error) {
        console.error("Delete calculation error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting calculation: " + error.message
        });
    }
};
import multer from 'multer'
import { computeUnits, extractAmount, extractBillDate, extractConsumerNo, extractName, extractReadings, preprocessImage, runTesseract } from "../utils.js";
const upload = multer({ dest: 'uploads/' }).single("pdfFile");

export const calBill = async (req, res) => {
    try {
        upload(req, res, async err => {
            if (!req.file) return res.status(400).json({ error: 'file required' });
            const inputPath = req.file.path;
            try {
                const pre = await preprocessImage(inputPath);
                const ocrText = await runTesseract(pre);

                fs.writeFileSync(pre + '.txt', ocrText);

                const consumerNo = extractConsumerNo(ocrText);
                const name = extractName(ocrText);
                const billDate = extractBillDate(ocrText);
                const amount = extractAmount(ocrText);

                const readings = extractReadings(ocrText);
                const units = computeUnits(readings);

                const result = {
                    consumerNo,
                    name,
                    billDate,
                    amount,
                    readings,
                    units,
                    rawTextPreview: ocrText.slice(0, 2000) // first 2000 chars for debugging
                };


                res.json({ success: true, result });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'ocr_failed', detail: err.message });
            } finally {
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error while calculation: " + error.message
        });
    }
}