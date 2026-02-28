// backend/claude.js
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert Ember.js to React conversion assistant.
You help developers convert their Ember apps to React.
When given Ember code, you can explain what it does, how it was converted to React, 
and answer any questions about the conversion.
Be concise, helpful, and technical.`;

async function chatWithClaude(messages) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages,
  });

  return response.content[0].text;
}

module.exports = { chatWithClaude };