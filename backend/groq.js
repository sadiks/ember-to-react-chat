// backend/groq.js
const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert Ember.js to React conversion assistant.
You help developers convert their Ember apps to React.
When given Ember code, explain what was converted and any important changes.
Be concise, helpful, and technical.`;

async function chatWithAI(messages) {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2048,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ]
  });

  return response.choices[0].message.content;
}

module.exports = { chatWithAI };