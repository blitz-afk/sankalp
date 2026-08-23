import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../../config/env.js';

let genAI = null;

const getAIClient = () => {
  if (genAI) return genAI;

  if (ENV.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Isolated wrapper for generating structured content via Gemini API
 * @param {string} prompt - Detailed prompt instruction
 * @param {object} options - Options including model, temperature, jsonMode
 * @returns {Promise<object|string>}
 */
export const generateAIContent = async (prompt, options = {}) => {
  try {
    const client = getAIClient();
    const modelName = options.model || 'gemini-1.5-flash';

    if (!client) {
      console.warn('[Gemini AI] API Key not set. Returning mock/fallback response.');
      return options.mockFallback ? options.mockFallback() : { text: 'AI key not configured' };
    }

    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: options.temperature ?? 0.2,
        responseMimeType: options.jsonMode ? 'application/json' : 'text/plain',
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    if (options.jsonMode) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('[Gemini AI] JSON parse error on AI response:', parseError);
        return { error: 'Failed to parse JSON response', raw: responseText };
      }
    }

    return responseText;
  } catch (error) {
    console.error(`[Gemini AI Error]: ${error.message}`);
    throw new Error(`AI Processing Error: ${error.message}`);
  }
};
