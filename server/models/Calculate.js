import mongoose from "mongoose";

const calculationSchema = new mongoose.Schema({
    usage: {
        type: Number,
        required: true
    },
    tariff: {
        type: Number,
        required: true
    },
    sunlight: {
        type: Number,
        required: true
    },
    efficiency: {
        type: Number,
        required: true
    },
    savings: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export default mongoose.model("Calculation", calculationSchema);
