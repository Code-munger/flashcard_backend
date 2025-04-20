const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const extractText = require('./utils/extractText');
const generateFlashcards = require('./utils/generateFlashcards');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Ensure uploads/ exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Test route
app.get('/', (req, res) => {
  res.send('Flashcard backend is running!');
});

// ✅ Upload + Process Route
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  try {
    const rawText = await extractText(req.file.path);
    const flashcards = generateFlashcards(rawText);

    console.log('📄 Extracted preview:', rawText.slice(0, 300));
    res.json({
      message: 'File processed',
      filename: req.file.filename,
      rawText: rawText.slice(0, 1000),
      flashcards
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Failed to extract text or generate flashcards.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

