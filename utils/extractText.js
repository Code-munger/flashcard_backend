const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }

  throw new Error(`Unsupported file type: ${ext}`);
}

module.exports = extractText;
