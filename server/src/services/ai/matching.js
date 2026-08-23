import { generateAIContent } from './geminiService.js';

/**
 * AI Matching Service: Matches challenges to universities or solutions to industry sponsors
 * @param {string} matchType - 'CHALLENGE_UNIVERSITY' or 'SOLUTION_INDUSTRY'
 * @param {object} sourceItem - The challenge or solution object
 * @param {Array<object>} targetCandidates - Candidates list (universities or industries)
 * @returns {Promise<Array<object>>} Ranked recommendations with suitability rationale
 */
export const matchEntity = async (matchType, sourceItem, targetCandidates = []) => {
  const prompt = `
You are the AI Matchmaker engine for SANKALP.
Match the given SOURCE entity with the most suitable TARGET candidates based on domain expertise, capabilities, and past projects.

Match Type: ${matchType}
SOURCE:
${JSON.stringify({
  title: sourceItem.title,
  domain: sourceItem.domain || sourceItem.category,
  abstract: sourceItem.abstract || sourceItem.statement,
})}

TARGET CANDIDATES:
${JSON.stringify(
  targetCandidates.map((c) => ({
    id: c._id,
    name: c.institutionName || c.companyName,
    focusAreas: c.focusAreas || c.interestDomains,
    location: c.location,
  }))
)}

Return a JSON array of matches ranked from highest fit to lowest:
[
  {
    "targetId": "string",
    "matchScore": number (0 to 100),
    "rationale": "string explanation of why this target is a strong fit"
  }
]
`;

  return await generateAIContent(prompt, {
    jsonMode: true,
    mockFallback: () =>
      targetCandidates.slice(0, 3).map((c, idx) => ({
        targetId: c._id?.toString() || `target-${idx}`,
        matchScore: 85 - idx * 10,
        rationale: 'Domain focus aligns with platform problem statement requirements.',
      })),
  });
};
