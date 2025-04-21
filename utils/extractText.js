const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  // Handle plain text files
  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  // Handle PDF files
  if (ext === '.pdf') {
    const buffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(buffer);

    if (parsed.text.trim()) {
      return parsed.text;
    }

    // Fallback to OCR if no text found in PDF
    console.log("🧠 No text found in PDF, trying OCR...");
    const result = await Tesseract.recognize(filePath, 'eng');
    return result.data.text;
  }

  // Fallback OCR for image-based files (optional)
  if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
    const result = await Tesseract.recognize(filePath, 'eng');
    return result.data.text;
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

module.exports = extractText;

