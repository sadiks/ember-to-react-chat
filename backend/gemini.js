const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are an expert Ember.js to React conversion assistant.
You help developers convert their Ember apps to React.
When given Ember code, explain what was converted and any important changes.
Be concise, helpful, and technical.`;

async function chatWithAI(messages) {
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],  // ← must be object not plain string
      role: 'system'
    }
  });

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const chat = model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    }
  });

  const lastMessage = messages[messages.length - 1].content;
  const result = await chat.sendMessage(lastMessage);
  return result.response.text();
}

module.exports = { chatWithAI };