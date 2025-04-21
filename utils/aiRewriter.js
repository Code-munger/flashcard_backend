// utils/aiRewriter.js
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function rewriteFlashcards(flashcards) {
  const rewritten = [];

  for (const card of flashcards) {
    const prompt = `
You are an AI assistant helping students study for certification exams.
You’ve been provided raw extracted text from a technical document.

From the content below, identify the most relevant or heavily weighted *topics*. For each topic, generate:
1. A few **knowledge-based** flashcards (fact recall)
2. A few **scenario-based** flashcards (real-world application)
3. A few **troubleshooting** flashcards (problem solving)

Here is the raw input:
"""
${card.question}: ${card.answer}
"""

Now respond with a JSON array of flashcard objects in this format:
[
  {
    "question": "What does XYZ mean?",
    "answer": "XYZ stands for ...",
    "topic": "Network Fundamentals"
  },
  ...
]
Only return the JSON array.
`;

    try {
      const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const aiReply = chatCompletion.choices[0].message.content.trim();
      const parsed = JSON.parse(aiReply);
      rewritten.push(...parsed);
    } catch (err) {
      console.error(`❌ Error with card: "${card.question}"`);
      console.error(err.message || err);
    }
  }

  return rewritten;
}

module.exports = rewriteFlashcards;


