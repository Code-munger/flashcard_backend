const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const extractText = require('./utils/extractText');
const generateFlashcards = require('./utils/generateFlashcards');
const rewriteFlashcards = require('./utils/aiRewriter'); // AI rephrasing module

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

// Health check route
app.get('/', (req, res) => {
  res.send('Flashcard backend is running!');
});

// Upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded.' });

    const filePath = path.join(__dirname, file.path);

    const rawText = await extractText(filePath);                        // Step 1: Extract text
    const rawFlashcards = generateFlashcards(rawText);                 // Step 2: Generate flashcards
    const polishedFlashcards = await rewriteFlashcards(rawFlashcards); // Step 3: Rephrase flashcards with AI

    res.json({
      message: 'File processed',
      filename: file.filename,
      rawText,
      flashcards: polishedFlashcards
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: 'Something went wrong.', error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});


