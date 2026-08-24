import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeProblem = async ({ title, description }) => {
    const prompt = `

You are an AI validation system for a civic problem reporting platform.

Analyze the provided IMAGE together with the TITLE and DESCRIPTION.

Your tasks:

1. Determine whether the image appears to show a genuine civic or infrastructure problem.
2. Determine whether the image matches the title and description.
3. Estimate your confidence in this assessment.
4. Categorize the civic problem using ONLY the allowed categories.
5. Identify the specific type of problem within that category.
6. Determine its severity.
7. Provide a concise summary.
8. Suggest the responsible department.
9. Assess whether the image may be AI-generated or synthetically created.

ALLOWED CATEGORIES:

- Road Damage
- Street Lighting
- Waste Management
- Water Supply
- Drainage
- Traffic Management
- Public Safety
- Public Transport
- Electricity
- Sanitation
- Other

CATEGORY RULES:

- Return exactly ONE category.
- The category MUST exactly match one of the allowed categories above.
- Do NOT create new categories.
- Do NOT use synonyms or variations.
- For potholes, damaged roads, road cracks, broken pavements, and similar road-surface problems, use "Road Damage".
- If the problem does not reasonably fit any category, use "Other".

PROBLEM TYPE RULES:

- problemType must describe the specific underlying issue.
- Use the same problemType for semantically similar reports.
- Do not create unnecessary variations of the same problem type.
- Keep problemType concise.
- Examples:
  - "Road Damage" → "Pothole"
  - "Road Damage" → "Road Cracking"
  - "Street Lighting" → "Broken Streetlight"
  - "Waste Management" → "Garbage Accumulation"
  - "Water Supply" → "Water Leakage"
  - "Traffic Management" → "Traffic Congestion"

Important:

- Use the image as visual evidence.
- Compare the image carefully with the title and description.
- Do not assume the user's description is correct.
- Do not treat AI-generation detection as definitive proof.
- Do not reject a report solely because the image may be AI-generated.
- Return ONLY valid JSON.
- Do not include markdown or explanations outside the JSON.

TITLE:
${title}

DESCRIPTION:
${description}

Return exactly:

{
    "isValid": true,
    "imageMatchesReport": true,
    "confidence": 0.0,
    "category": "Road Damage",
    "problemType": "Pothole",
    "severity": "High",
    "summary": "string",
    "suggestedDepartment": "string",
    "possibleAiGeneratedImage": false
}

`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    return JSON.parse(response.text);
};

export default analyzeProblem;