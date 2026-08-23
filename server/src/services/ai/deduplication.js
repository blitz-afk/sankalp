import { generateAIContent } from './geminiService.js';

/**
 * AI Deduplication Service: Detects duplicate or related societal problems
 * @param {object} newProblem - The newly submitted problem
 * @param {Array<object>} existingProblems - Candidate list of existing problems in the same domain/location
 * @returns {Promise<object>} Deduplication analysis results
 */
export const checkDuplicateProblem = async (newProblem, existingProblems = []) => {
  if (!existingProblems || existingProblems.length === 0) {
    return {
      isDuplicate: false,
      similarityScore: 0,
      matchedProblemId: null,
      notes: 'No existing problems in domain for comparison.',
    };
  }

  const prompt = `
You are a deduplication specialist for the SANKALP platform.
Compare the NEW problem against the list of EXISTING problems to determine if it describes the same issue or location.

NEW PROBLEM:
Title: ${newProblem.title}
Description: ${newProblem.description}
City/State: ${newProblem.location?.city || ''}, ${newProblem.location?.state || ''}

EXISTING CANDIDATES:
${JSON.stringify(
  existingProblems.map((p) => ({
    id: p._id,
    title: p.title,
    description: p.description?.substring(0, 150),
    city: p.location?.city,
  }))
)}

Return a JSON object:
{
  "isDuplicate": boolean,
  "similarityScore": number (0 to 100),
  "matchedProblemId": string or null,
  "notes": "string explanation of similarity or differentiation"
}
`;

  return await generateAIContent(prompt, {
    jsonMode: true,
    mockFallback: () => ({
      isDuplicate: false,
      similarityScore: 10,
      matchedProblemId: null,
      notes: 'No substantial overlap detected.',
    }),
  });
};
