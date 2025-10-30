import express from "express";
import Calculation from "../models/Calculate.js";

const router = express.Router();

// POST /api/calculate
router.post("/", async (req, res) => {
    try {
        const { usage, tariff, sunlight, efficiency } = req.body;

        if (!usage || !tariff || !sunlight || !efficiency) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Calculation formula
        const monthly = usage * tariff * 30;
        const savings = (monthly * (efficiency / 100)) / sunlight;

        // Save to database
        const calc = new Calculation({
            usage,
            tariff,
            sunlight,
            efficiency,
            savings: savings.toFixed(2),
        });

        await calc.save();

        res.json({ savings: savings.toFixed(2) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
