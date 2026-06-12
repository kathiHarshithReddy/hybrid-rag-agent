import { withRetry } from './retry.js';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Calls Anthropic Claude API with retry support.
 * @param {{ apiKey: string, systemPrompt: string, userMessage: string, model?: string }} params
 */
export async function callClaude({ apiKey, systemPrompt, userMessage, model = 'claude-sonnet-4-6' }) {
  return withRetry(async () => {
    const response = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text ?? 'No response.';
  });
}
