const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite'; // ✅ safe fallback
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = { genAI, getModel };