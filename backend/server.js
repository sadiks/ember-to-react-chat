// backend/server.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const { convertFile } = require('./converter');
// const { chatWithClaude } = require('./claude');
// const { chatWithAI } = require('./openai');
// const { chatWithAI } = require('./gemini');
const { chatWithAI } = require('./groq');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Upload and convert file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const originalName = req.file.originalname;
    const ext = path.extname(originalName);

    // Read uploaded file content
    const content = fs.readFileSync(file.path, 'utf-8');

    // Convert using our tool
    const { converted, todos, type } = convertFile(content, ext, originalName);

    // Also send to Claude for explanation
    const explanation = await chatWithAI([
      {
        role: 'user',
        content: `I just converted this Ember ${ext} file to React. 
        
Original file:
\`\`\`
${content}
\`\`\`

Converted React code:
\`\`\`
${converted}
\`\`\`

Please briefly explain what was converted and any important changes the developer should know about.`
      }
    ]);

    // Cleanup uploaded file
    fs.removeSync(file.path);

    res.json({
      success: true,
      fileName: originalName,
      type,
      converted,
      todos,
      explanation,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const reply = await chatWithAI(messages);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log('🚀 Backend running on http://localhost:4000'));