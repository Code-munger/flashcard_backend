function generateFlashcards(text) {
    const flashcards = [];
    // Extract acronyms like "12B", "OSHA", etc.
    const acronymRegex = /\b([A-Z]{2,}|[A-Z]+\d+|\d+[A-Z]+)\b/g;
    const found = [...new Set(text.match(acronymRegex))];
  
    found.forEach(acronym => {
      flashcards.push({
        question: `What does ${acronym} mean?`,
        answer: `(Define: ${acronym})` // Placeholder until we add real meaning
      });
    });
  
    // (Later we’ll add key term/definition detection and GPT enrichment)
  
    return flashcards;
  }
  
  module.exports = generateFlashcards;
  