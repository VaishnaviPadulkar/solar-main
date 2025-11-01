import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.routes.js";
import CalculateRoute from "./routes/calculator.routes.js";
import ContactRoute from "./routes/contact.routes.js";
import AdminRoute from "./routes/admin.routes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Then use the controller
// app.post('/upload', upload.single('bill'), pdfController.processBill);

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/add", ContactRoute);
app.use("/api/calculate", CalculateRoute);
app.use("/api/admin", AdminRoute);

// Test route
app.get("/api/test", (req, res) => {
    res.json({ success: true, message: "Backend server is running!" });
});

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/solarDB";

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

export default app;