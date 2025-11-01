// // server.js
// const express = require('express');
// const multer = require('multer');
// const sharp = require('sharp');
// const { createWorker } = require('tesseract.js');
// const asyncHandler = require('express-async-handler');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');
// // const { createWorker } = require('tesseract.js');


// const upload = multer({ dest: 'uploads/' });
// const app = express();
// app.use(cors());
// app.use(express.json());

// /**
//  * Helper: run basic preprocessing (resize, greyscale, increase contrast)
//  * returns path to preprocessed image
//  */
// async function preprocessImage(inputPath) {
//     const outPath = inputPath + '_pre.jpg';
//     await sharp(inputPath)
//         .resize({ width: 1600 })       // scale up or down depending on input
//         .grayscale()
//         .normalise()                   // improve contrast / normalize
//         .toFile(outPath);
//     return outPath;
// }

// /**
//  * Helper: run Tesseract on image
//  */
// async function runTesseract(imagePath) {
//     // const worker = await createWorker();
//     const worker = await createWorker("eng");

//     const { data } = await worker.recognize(imagePath);
//     await worker.terminate();
//     return data.text;
// }

// /**
//  * Parsers for fields from OCR text
//  */
// function extractField(text, patterns) {
//     for (const p of patterns) {
//         const m = text.match(p);
//         if (m && m[1]) return m[1].trim();
//     }
//     return null;
// }

// function extractConsumerNo(text) {
//     // common variants
//     const patterns = [
//         /Consumer\s*No[:\s]*([A-Z0-9\-]+)/i,
//         /CONSUMER\s*NO[:\s]*([A-Z0-9\-]+)/i,
//         /Consumer\s*No\.\s*([0-9A-Z\-]+)/i,
//         /Account\s*No[:\s]*([0-9A-Z\-]+)/i,
//         /Account\s*Number[:\s]*([0-9A-Z\-]+)/i,
//         /\b([0-9]{6,14})\b/ // fallback: long number
//     ];
//     return extractField(text, patterns);
// }

// function extractName(text) {
//     // Many electricity bills use MR./MRS./M/s etc.
//     const patterns = [
//         /\bMR\.?\s*([A-Z][A-Z\s]{2,60})/i,
//         /\bMRS\.?\s*([A-Z][A-Z\s]{2,60})/i,
//         /Consumer\s*Name[:\s]*([A-Z][A-Z\s]{2,60})/i,
//         /Name[:\s]*([A-Z][A-Z\s]{2,60})/i
//     ];
//     // try the patterns, fallback: line after "Consumer No" might be the name
//     const direct = extractField(text, patterns);
//     if (direct) return direct.replace(/\s{2,}/g, ' ');
//     // fallback approach: find "CONSUMER NO" and take next uppercase line
//     const idx = text.search(/Consumer\s*No[:\s]/i);
//     if (idx >= 0) {
//         const after = text.slice(idx, idx + 150); // small window
//         const nameMatch = after.match(/(?:Consumer\s*No[:\s][0-9A-Z\-]+\s)([A-Z][A-Z\s]{2,60})/i);
//         if (nameMatch && nameMatch[1]) return nameMatch[1].trim();
//     }
//     return null;
// }

// function extractBillDate(text) {
//     const patterns = [
//         /Bill Date[:\s]*([0-9]{1,2}[-\/\s][A-Za-z0-9]{1,3}[-\/\s][0-9]{2,4})/i,
//         /Bill Date[:\s]*([0-9]{2}[-\/][0-9]{2}[-\/][0-9]{2,4})/i,
//         /Date[:\s]*([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4})/i
//     ];
//     return extractField(text, patterns);
// }

// function extractAmount(text) {
//     const patterns = [
//         /Bill Amount\s*Rs[:\s]([0-9,]+\.?[0-9])/i,
//         /Bill Amount[:\s]([0-9,]+\.?[0-9])/i,
//         /Amount[:\s]Rs\.?\s([0-9,]+\.?[0-9]*)/i,
//         /Total[:\s]Rs[:\s]([0-9,]+\.?[0-9]*)/i
//     ];
//     const raw = extractField(text, patterns);
//     if (!raw) return null;
//     return raw.replace(/,/g, '');
// }

// /**
//  * Extract meter readings (current / previous) by searching table-like patterns
//  * This tries multiple approaches since OCR of tabular data often becomes a stream of numbers.
//  */
// function extractReadings(text) {
//     // Attempt 1: look for "Current Reading" and "Previous Reading"
//     const current = extractField(text, [/Current\s*Reading[:\s]([0-9]+)/i, /Current\s*Reading\s([0-9]{3,})/i]);
//     const previous = extractField(text, [/Previous\s*Reading[:\s]([0-9]+)/i, /Previous\s*Reading\s([0-9]{3,})/i]);
//     if (current || previous) {
//         return {
//             current: current ? parseInt(current.replace(/\D/g, ''), 10) : null,
//             previous: previous ? parseInt(previous.replace(/\D/g, ''), 10) : null
//         };
//     }

//     // Attempt 2: look for a small block of consecutive numbers (often table)
//     // Extract all numbers with 3+ digits (meter readings are usually 3+ digits)
//     const numbers = Array.from(text.matchAll(/\b([0-9]{3,7})\b/g)).map(m => parseInt(m[1], 10));
//     if (numbers.length >= 2) {
//         // heuristic: the two closest numbers likely previous/current
//         // choose last two as current & previous
//         const curr = numbers[numbers.length - 1];
//         const prev = numbers[numbers.length - 2];
//         return { current: curr, previous: prev };
//     }

//     return { current: null, previous: null };
// }

// function computeUnits(readings) {
//     if (readings.current != null && readings.previous != null) {
//         const units = readings.current - readings.previous;
//         return units >= 0 ? units : null;
//     }
//     return null;
// }

// /**
//  * Main route: upload image, preprocess, OCR, parse
//  */
// app.post('/upload', upload.single('bill'), asyncHandler(async (req, res) => {
//     if (!req.file) return res.status(400).json({ error: 'file required' });
//     const inputPath = req.file.path;
//     try {
//         const pre = await preprocessImage(inputPath);
//         const ocrText = await runTesseract(pre);

//         // Save OCR to disk for debugging
//         fs.writeFileSync(pre + '.txt', ocrText);

//         // Parse fields
//         const consumerNo = extractConsumerNo(ocrText);
//         const name = extractName(ocrText);
//         const billDate = extractBillDate(ocrText);
//         const amount = extractAmount(ocrText);

//         const readings = extractReadings(ocrText);
//         const units = computeUnits(readings);

//         const result = {
//             consumerNo,
//             name,
//             billDate,
//             amount,
//             readings,
//             units,
//             rawTextPreview: ocrText.slice(0, 2000) // first 2000 chars for debugging
//         };

//         // cleanup uploads if desired
//         // fs.unlinkSync(inputPath);
//         // fs.unlinkSync(pre);

//         res.json({ success: true, result });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'ocr_failed', detail: err.message });
//     } finally {
//         // optional: remove the uploaded file here
//         // try { fs.unlinkSync(inputPath); } catch (e) {}
//     }
// }));

// app.get('/', (req, res) => res.send('Tesseract OCR bill parser is running. POST /upload with form-data file=bill'));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server started on ${PORT}`));