// backend/openai.js
const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert Ember.js to React conversion assistant.
You help developers convert their Ember apps to React.
When given Ember code, you can explain what it does, how it was converted to React,
and answer any questions about the conversion.
Be concise, helpful, and technical.`;

async function chatWithAI(messages) {
  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',        // or 'gpt-4' if you have access
    max_tokens: 2048,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ],
  });

  return response.choices[0].message.content;
}

module.exports = { chatWithAI };