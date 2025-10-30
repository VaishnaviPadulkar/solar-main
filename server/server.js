import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/auth.routes.js"
import CalculateRoute from "./routes/calculator.routes.js"
import ContactRoute from "./routes/contact.routes.js";
import AdminRoute from "./routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", AuthRoute);
app.use("/api/add", ContactRoute);
app.use("/api/calculate", CalculateRoute);
app.use("/api/admin", AdminRoute);


// Test route
app.get("/", (req, res) => res.send("API running"));
app.use((req, res) => {
    res.status(404).json({ message: "Resource Not Found." })
})
// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

export default app;

