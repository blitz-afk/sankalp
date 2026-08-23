import { generateAIContent } from './geminiService.js';

/**
 * AI Categorization Service: Categorizes societal problem descriptions
 * @param {object} problemData - Title and description of societal problem
 * @returns {Promise<object>} Structured category, domain, keywords, and summary
 */
export const categorizeProblem = async (problemData) => {
  const { title, description } = problemData;

  const prompt = `
You are an expert societal problem analyst for the SANKALP platform.
Analyze the following societal problem report and return a JSON object with:
1. "category": Primary societal sector (e.g. "Water & Sanitation", "Renewable Energy", "Waste Management", "Healthcare & Hygiene", "Agriculture & Rural Dev", "Urban Mobility", "Education & Skill", "Disaster Resilience")
2. "domain": Higher level theme
3. "keywords": Array of 3 to 6 key terms
4. "summary": A concise 2-sentence executive summary of the problem

Problem Title: ${title}
Problem Description: ${description}

Respond ONLY with a valid JSON object in this format:
{
  "category": "string",
  "domain": "string",
  "keywords": ["tag1", "tag2", "tag3"],
  "summary": "string"
}
`;

  return await generateAIContent(prompt, {
    jsonMode: true,
    mockFallback: () => ({
      category: 'Community & Infrastructure',
      domain: 'Civic Development',
      keywords: ['infrastructure', 'community', 'civic-issue'],
      summary: `${title} - Citizen reported societal challenge requiring academic & technical intervention.`,
    }),
  });
};
