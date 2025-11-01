import express from "express";
import { adminAuth } from "../middleware/adminAuth.js";
import { deleteUser, getAllUsers, loginAdmin, registerAdmin } from "../controllers/adminController.js";

const router = express.Router();


// Admin registration
router.post("/register", registerAdmin);

// Admin login
router.post("/login", loginAdmin);

// Protected routes
router.get("/admin/users", adminAuth, getAllUsers);
router.delete("/admin/users/:id", adminAuth, deleteUser);

export default router;