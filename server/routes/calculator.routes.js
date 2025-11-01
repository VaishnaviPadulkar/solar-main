import express from "express";
import {
    getCalculations,
    deleteCalculation,
    getCalculationStats,
    calBill,
} from "../controllers/calculationController.js";
// import { testPDFProcessing } from "../controllers/pdfController.js";

const router = express.Router();



// GET /api/calculate/test-pdf - Test PDF processing
router.post("/process-pdf-calculate", calBill);
// router.get("/test-pdf", testPDFProcessing);

// GET /api/calculate - Get all calculations
router.get("/", getCalculations);

// GET /api/calculate/stats - Get calculation statistics
router.get("/stats", getCalculationStats);

// DELETE /api/calculate/:id - Delete calculation
router.delete("/:id", deleteCalculation);

export default router;