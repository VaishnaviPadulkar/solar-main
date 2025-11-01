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
        required: true,
        default: 5
    },
    efficiency: {
        type: Number,
        required: true,
        default: 75
    },
    savings: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        enum: ['manual', 'pdf'],
        default: 'manual'
    },
    pdfFileName: {
        type: String,
        default: null
    },
    extractedData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    monthlyCost: {
        type: Number,
        required: true
    },
    yearlySavings: {
        type: Number,
        required: true
    },
    customerName: {
        type: String,
        default: ''
    },
    billDate: {
        type: Date,
        default: null
    },
    // In your Calculate.js model, ensure extractedData can store OCR details
    extractedData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },

});

export default mongoose.model("Calculation", calculationSchema);