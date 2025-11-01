import sharp from "sharp";
import { createWorker } from 'tesseract.js'
export async function preprocessImage(inputPath) {
    const outPath = inputPath + '_pre.jpg';
    await sharp(inputPath)
        .resize({ width: 1600 })       // scale up or down depending on input
        .grayscale()
        .normalise()                   // improve contrast / normalize
        .toFile(outPath);
    return outPath;
}
export async function runTesseract(imagePath) {
    // const worker = await createWorker();
    const worker = await createWorker("eng");

    const { data } = await worker.recognize(imagePath);
    await worker.terminate();
    return data.text;
}
export function extractField(text, patterns) {
    for (const p of patterns) {
        const m = text.match(p);
        if (m && m[1]) return m[1].trim();
    }
    return null;
}

export function extractConsumerNo(text) {
    // common variants
    const patterns = [
        /Consumer\s*No[:\s]*([A-Z0-9\-]+)/i,
        /CONSUMER\s*NO[:\s]*([A-Z0-9\-]+)/i,
        /Consumer\s*No\.\s*([0-9A-Z\-]+)/i,
        /Account\s*No[:\s]*([0-9A-Z\-]+)/i,
        /Account\s*Number[:\s]*([0-9A-Z\-]+)/i,
        /\b([0-9]{6,14})\b/ // fallback: long number
    ];
    return extractField(text, patterns);
}

export function extractName(text) {
    // Many electricity bills use MR./MRS./M/s etc.
    const patterns = [
        /\bMR\.?\s*([A-Z][A-Z\s]{2,60})/i,
        /\bMRS\.?\s*([A-Z][A-Z\s]{2,60})/i,
        /Consumer\s*Name[:\s]*([A-Z][A-Z\s]{2,60})/i,
        /Name[:\s]*([A-Z][A-Z\s]{2,60})/i
    ];
    // try the patterns, fallback: line after "Consumer No" might be the name
    const direct = extractField(text, patterns);
    if (direct) return direct.replace(/\s{2,}/g, ' ');
    // fallback approach: find "CONSUMER NO" and take next uppercase line
    const idx = text.search(/Consumer\s*No[:\s]/i);
    if (idx >= 0) {
        const after = text.slice(idx, idx + 150); // small window
        const nameMatch = after.match(/(?:Consumer\s*No[:\s]*[0-9A-Z\-]+\s*)([A-Z][A-Z\s]{2,60})/i);
        if (nameMatch && nameMatch[1]) return nameMatch[1].trim();
    }
    return null;
}

export function extractBillDate(text) {
    const patterns = [
        /Bill Date[:\s]*([0-9]{1,2}[-\/\s][A-Za-z0-9]{1,3}[-\/\s][0-9]{2,4})/i,
        /Bill Date[:\s]*([0-9]{2}[-\/][0-9]{2}[-\/][0-9]{2,4})/i,
        /Date[:\s]*([0-9]{1,2}[-\/][0-9]{1,2}[-\/][0-9]{2,4})/i
    ];
    return extractField(text, patterns);
}

export function extractAmount(text) {
    const patterns = [
        /Bill Amount\s*Rs[:\s]*([0-9,]+\.?[0-9]*)/i,
        /Bill Amount[:\s]*([0-9,]+\.?[0-9]*)/i,
        /Amount[:\s]*Rs\.?\s*([0-9,]+\.?[0-9]*)/i,
        /Total[:\s]*Rs[:\s]*([0-9,]+\.?[0-9]*)/i
    ];
    const raw = extractField(text, patterns);
    if (!raw) return null;
    return raw.replace(/,/g, '');
}


export function extractReadings(text) {
    const current = extractField(text, [/Current\s*Reading[:\s]*([0-9]+)/i, /Current\s*Reading\s*([0-9]{3,})/i]);
    const previous = extractField(text, [/Previous\s*Reading[:\s]*([0-9]+)/i, /Previous\s*Reading\s*([0-9]{3,})/i]);
    if (current || previous) {
        return {
            current: current ? parseInt(current.replace(/\D/g, ''), 10) : null,
            previous: previous ? parseInt(previous.replace(/\D/g, ''), 10) : null
        };
    }

    const numbers = Array.from(text.matchAll(/\b([0-9]{3,7})\b/g)).map(m => parseInt(m[1], 10));
    if (numbers.length >= 2) {
        const curr = numbers[numbers.length - 1];
        const prev = numbers[numbers.length - 2];
        return { current: curr, previous: prev };
    }

    return { current: null, previous: null };
}

export function computeUnits(readings) {
    if (readings.current != null && readings.previous != null) {
        const units = readings.current - readings.previous;
        return units >= 0 ? units : null;
    }
    return null;
}
