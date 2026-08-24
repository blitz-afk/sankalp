import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateChallenge = async ({
    category,
    problemType,
    problems
}) => {

    const reports = problems.map((problem, index) => ({
        reportNumber: index + 1,
        title: problem.title,
        description: problem.description,
        severity: problem.aiAnalysis?.severity,
        summary: problem.aiAnalysis?.summary
    }));

    const prompt = `

You are an AI system that converts validated citizen reports
into meaningful real-world innovation challenges.

The reports below have been validated and identified as the
same specific recurring problem.

BROAD CATEGORY:

${category}

SPECIFIC PROBLEM TYPE:

${problemType}

REPORTS:

${JSON.stringify(reports, null, 2)}

Analyze the reports collectively.

The BROAD CATEGORY represents the general civic domain.

The SPECIFIC PROBLEM TYPE represents the recurring issue
that these reports have in common.

Generate ONE challenge specifically addressing this
problem type.

Do NOT simply rewrite an individual citizen report.

The challenge should:

- Address the underlying systemic problem.
- Be specific enough to solve.
- Be broad enough to support a scalable solution.
- Be suitable for universities, startups, industries,
  research organizations, or innovation teams.
- Focus on a practical and scalable solution.
- Use the reports as evidence.
- Stay focused on the specified problem type.
- Do not introduce a different problem or category.

Identify the technical or academic domains required to
solve this challenge.

Examples:

- Artificial Intelligence
- Computer Vision
- IoT
- Civil Engineering
- Materials Science
- Robotics
- Traffic Engineering
- Environmental Engineering

Rules for requiredDomains:

- Return 2-5 relevant domains.
- Use clear, standardized domain names.
- Prefer the provided domain names when applicable.
- Do not return duplicate domains.
- Domains must be directly relevant to solving the challenge.

Return ONLY valid JSON.
Do not include markdown or explanations outside the JSON.

Return exactly:

{
    "category": "string",
    "requiredDomains": [
        "string"
    ],
    "title": "string",
    "problemStatement": "string",
    "objective": "string",
    "expectedOutcome": "string"
}

`;

    try {

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        return JSON.parse(response.text);

    } catch (error) {

        console.error(
            "CHALLENGE GENERATION ERROR:",
            error
        );

        throw error;
    }
};

export default generateChallenge;