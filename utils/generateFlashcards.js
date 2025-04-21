// utils/generateFlashcards.js
const rewriteFlashcards = require("./aiRewriter");

function generateInitialFlashcards(text) {
  const flashcards = [];

  // --- Acronym Definitions ---
  const acronymDefinitions = {
    OSHA: "Occupational Safety and Health Administration",
    HVAC: "Heating, Ventilation, and Air Conditioning",
    SOP: "Standard Operating Procedure",
    CNC: "Computer Numerical Control",
    PPE: "Personal Protective Equipment",
    "12B": "Combat Engineer",
    QA: "Quality Assurance",
    PM: "Project Management"
  };

  const topics = {
    safety: "Workplace Safety",
    combat: "Military",
    manufacturing: "Engineering",
    engineer: "Engineering",
    biology: "Biology",
    chemistry: "Chemistry",
    policy: "Law",
    maintenance: "Maintenance",
    inspection: "Compliance"
  };

  const stateCodes = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
    "VA", "WA", "WV", "WI", "WY"
  ];

  // --- Detect Topic ---
  let detectedTopic = "General";
  for (let keyword in topics) {
    if (text.toLowerCase().includes(keyword)) {
      detectedTopic = topics[keyword];
      break;
    }
  }

  // --- Acronym Extraction ---
  const acronymRegex = /\b([A-Z]{2,6}|\d+[A-Z]+|[A-Z]+\d+)\b/g;
  const found = [...new Set(text.match(acronymRegex))];

  const filtered = found.filter(acronym => {
    const isLikelyAcronym = /^[A-Z]{2,6}$/.test(acronym);
    const isStateCode = stateCodes.includes(acronym);
    return (acronymDefinitions[acronym] || isLikelyAcronym) && !isStateCode;
  });

  filtered.forEach(acronym => {
    flashcards.push({
      question: `What does ${acronym} mean?`,
      answer: acronymDefinitions[acronym] || `(Define: ${acronym})`,
      topic: detectedTopic
    });
  });

  // --- Sentence-Based Extraction ---
  const sentences = text.split(/[.?!]\s+/);
  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase();

    if (lower.includes(" is ") && sentence.length > 25) {
      const parts = sentence.split(" is ");
      if (parts.length === 2) {
        const subject = parts[0].trim();
        const explanation = parts[1].trim().replace(/\.$/, "");
        flashcards.push({
          question: `What is ${subject}?`,
          answer: explanation,
          topic: detectedTopic
        });
      }
    }

    if (lower.includes(" are ") && sentence.length > 25) {
      const parts = sentence.split(" are ");
      if (parts.length === 2) {
        const subject = parts[0].trim();
        const explanation = parts[1].trim().replace(/\.$/, "");
        flashcards.push({
          question: `Why are ${subject} important?`,
          answer: explanation,
          topic: detectedTopic
        });
      }
    }
  });

  return flashcards;
}

async function generateFlashcards(text) {
  const rawCards = generateInitialFlashcards(text);

  const filtered = rawCards.filter(
    card => card.question && card.question.length > 8 && card.answer && card.answer.length > 2
  );

  try {
    const rewritten = await rewriteFlashcards(filtered);
    return rewritten;
  } catch (err) {
    console.warn("⚠️ AI rewrite failed, falling back to raw cards.");
    return filtered;
  }
}

module.exports = generateInitialFlashcards;


  
  
  
  
  
  