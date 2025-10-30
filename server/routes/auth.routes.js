import express from "express";
import { registerUser, loginUser, getAllUsers, deleteUser } from "../controllers/authController.js"

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);       // GET all users
router.delete("/:id", deleteUser);

export default router;
