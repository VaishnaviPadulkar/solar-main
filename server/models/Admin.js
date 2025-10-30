import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, // trim is used for special characters
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Admin", adminSchema);
