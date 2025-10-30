import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword,
        });

        // Remove password from response
        const adminResponse = {
            id: newAdmin._id,
            name: newAdmin.name,
            email: newAdmin.email,
            role: "admin"
        };

        res.status(201).json({
            message: "Admin created successfully",
            admin: adminResponse
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🟢 Login Request Body:", req.body);

        // Check if fields are empty
        if (!email || !password) {
            console.log("⚠️ Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find admin by email
        const admin = await Admin.findOne({ email });
        console.log("🟡 Found Admin:", admin ? admin.email : "Not found");

        if (!admin) {
            console.log("❌ Admin not found");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        console.log("🔐 Password Match Result:", isMatch);

        if (!isMatch) {
            console.log("❌ Password mismatch");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Fix JWT secret (correct the typo)
        const jwtSecret = process.env.JWT_SECRET || process.env.JWT_SECREAT || "fallback_secret";

        if (!jwtSecret) {
            console.error("🚨 JWT_SECRET is missing!");
            return res.status(500).json({ message: "Server configuration error" });
        }

        // Generate token with role
        const token = jwt.sign(
            {
                id: admin._id,
                role: "admin",
                email: admin.email
            },
            jwtSecret,
            { expiresIn: "1d" }
        );

        console.log("✅ Token generated successfully for:", admin.email);

        // Send success response
        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: "admin"
            },
        });

    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};