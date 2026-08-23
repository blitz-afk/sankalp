import { generateAIContent } from './geminiService.js';

/**
 * AI Prioritization Service: Calculates urgency and impact scores for societal problems
 * @param {object} problemData - Problem details including location and reported impact
 * @returns {Promise<object>} Prioritization metrics and reasoning
 */
export const prioritizeProblem = async (problemData) => {
  const { title, description, location } = problemData;

  const prompt = `
You are a public policy and impact assessment AI for SANKALP.
Evaluate the severity, urgency, and societal impact of this reported problem.

Title: ${title}
Description: ${description}
Location: ${JSON.stringify(location || {})}

Return a JSON object with:
- "urgencyScore": Number from 1 to 100 (how immediate is the threat/need)
- "impactScore": Number from 1 to 100 (how broad is the affected population/benefit)
- "priorityLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
- "reasoning": Brief explanation of the assigned scores
- "targetBeneficiaries": Estimated affected community description

Respond ONLY with valid JSON:
{
  "urgencyScore": number,
  "impactScore": number,
  "priorityLevel": "string",
  "reasoning": "string",
  "targetBeneficiaries": "string"
}
`;

  return await generateAIContent(prompt, {
    jsonMode: true,
    mockFallback: () => ({
      urgencyScore: 75,
      impactScore: 80,
      priorityLevel: 'HIGH',
      reasoning: 'Baseline automated priority assigned based on societal community scope.',
      targetBeneficiaries: 'Local municipal residents',
    }),
  });
};
