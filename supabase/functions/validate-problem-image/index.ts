// validate-problem-image edge function
// Pre-validates image (black/blank/corrupted detection), sends actual
// image to Gemini, post-validates the response. Never returns isValid:true on failure.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ALLOWED_CATEGORIES = ["Road Damage","Street Lighting","Waste Management","Water Supply","Drainage","Traffic Management","Public Safety","Public Transport","Electricity","Sanitation","Other"];
const ALLOWED_SEVERITIES = ["Low","Medium","High","Critical"];
const MIN_CONFIDENCE = 0.5;

async function decodeImage(buffer: Uint8Array): Promise<{width:number;height:number;pixels:Uint8ClampedArray|null}> {
  try {
    const blob = new Blob([buffer]);
    // @ts-ignore createImageBitmap available in Deno
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    bitmap.close();
    return { width: imageData.width, height: imageData.height, pixels: imageData.data };
  } catch {
    // Fallback: validate file header
    const isPng = buffer[0]===0x89 && buffer[1]===0x50 && buffer[2]===0x4e && buffer[3]===0x47;
    const isJpeg = buffer[0]===0xff && buffer[1]===0xd8;
    const isWebp = buffer[0]===0x52 && buffer[1]===0x49 && buffer[2]===0x46 && buffer[3]===0x46 && buffer[8]===0x57 && buffer[9]===0x45 && buffer[10]===0x42 && buffer[11]===0x50;
    if (!isPng && !isJpeg && !isWebp) throw new Error("Unrecognized or corrupted image format");
    return { width: 0, height: 0, pixels: null };
  }
}

async function prevalidateImage(buffer: Uint8Array): Promise<{valid:boolean;reason:string}> {
  const MIN_SIZE = 2048;
  if (!buffer || buffer.length < MIN_SIZE) return { valid: false, reason: "Image is too small or empty. Please retake the photo." };

  let decoded;
  try { decoded = await decodeImage(buffer); }
  catch { return { valid: false, reason: "Image is corrupted or unreadable. Please retake the photo." }; }

  if (decoded.width > 0 && decoded.height > 0) {
    if (decoded.width < 32 || decoded.height < 32) return { valid: false, reason: "Image resolution is too low. Please retake the photo." };
  }

  if (decoded.pixels && decoded.pixels.length >= 4) {
    const pixels = decoded.pixels;
    const sampleStep = Math.max(1, Math.floor(pixels.length / 4000));
    let sum = 0, sumSq = 0, count = 0;
    let firstR = pixels[0], firstG = pixels[1], firstB = pixels[2];
    let allSame = true;

    for (let i = 0; i < pixels.length; i += sampleStep * 4) {
      const r = pixels[i], g = pixels[i+1], b = pixels[i+2];
      if (allSame && (r !== firstR || g !== firstG || b !== firstB)) allSame = false;
      const brightness = (r + g + b) / 3;
      sum += brightness; sumSq += brightness * brightness; count++;
    }

    if (allSame && count > 10) return { valid: false, reason: "Image appears to be blank or uniform. Please retake the photo." };

    if (count > 0) {
      const avg = sum / count;
      const variance = count > 1 ? sumSq / count - avg * avg : 0;
      const stdDev = Math.sqrt(Math.max(0, variance));
      // Reject only if BOTH very low brightness AND near-zero variance
      if (avg < 8 && stdDev < 5) return { valid: false, reason: "Image is too dark to analyze. Please retake the photo in better lighting." };
    }
  }

  return { valid: true, reason: "" };
}

async function analyzeWithGemini(imageBuffer: Uint8Array, mimeType: string, title: string, description: string): Promise<Record<string, unknown>> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) throw new Error("Gemini API key is not configured");

  const base64Image = btoa(String.fromCharCode(...imageBuffer));

  const prompt = `You are an AI validation system for a civic problem reporting platform.

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

ALLOWED CATEGORIES: Road Damage, Street Lighting, Waste Management, Water Supply, Drainage, Traffic Management, Public Safety, Public Transport, Electricity, Sanitation, Other

CATEGORY RULES:
- Return exactly ONE category. Must match exactly.
- For potholes, damaged roads, road cracks, broken pavements use "Road Damage".
- If the problem doesn't fit any category use "Other".

PROBLEM TYPE RULES:
- Describe the specific underlying issue. Keep concise.

Important:
- Use the image as visual evidence.
- Compare the image carefully with the title and description.
- If the image is black, blank, corrupted, or does not show a real problem, set isValid to false.
- Return ONLY valid JSON.

TITLE: ${title}
DESCRIPTION: ${description}

Return exactly:
{"isValid":true,"imageMatchesReport":true,"confidence":0.0,"category":"Road Damage","problemType":"Pothole","severity":"High","summary":"string","suggestedDepartment":"string","possibleAiGeneratedImage":false}`;

  const requestBody = {
    contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64Image } }] }],
    generationConfig: { responseMimeType: "application/json" },
  };

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestBody),
  });

  if (!response.ok) { const errText = await response.text(); throw new Error(`Gemini API error (${response.status}): ${errText}`); }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");
  return JSON.parse(text);
}

function validateGeminiResponse(analysis: Record<string, unknown>): {valid:boolean;reason:string} {
  if (!analysis || typeof analysis !== "object") return { valid: false, reason: "AI returned an invalid response. Please retake the photo." };
  if (analysis.isValid !== true) return { valid: false, reason: "AI could not validate this image as a genuine problem. Please retake the photo." };
  const confidence = Number(analysis.confidence);
  if (isNaN(confidence) || confidence < MIN_CONFIDENCE) return { valid: false, reason: "AI confidence is too low to validate this image. Please retake the photo." };
  if (!ALLOWED_CATEGORIES.includes(analysis.category as string)) return { valid: false, reason: "AI returned an unrecognized category. Please retake the photo." };
  if (!ALLOWED_SEVERITIES.includes(analysis.severity as string)) return { valid: false, reason: "AI returned an unrecognized severity. Please retake the photo." };
  for (const field of ["problemType","summary","suggestedDepartment"]) {
    const val = analysis[field];
    if (typeof val !== "string" || val.trim().length === 0) return { valid: false, reason: "AI returned an incomplete analysis. Please retake the photo." };
  }
  if (analysis.imageMatchesReport !== true) return { valid: false, reason: "The image does not appear to match the reported problem. Please retake the photo." };
  return { valid: true, reason: "" };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    if (req.method !== "POST") return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const { image, mimeType, title, description } = body;

    if (!image || typeof image !== "string") return new Response(JSON.stringify({ success: false, error: "Image data is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!mimeType || !mimeType.startsWith("image/")) return new Response(JSON.stringify({ success: false, error: "Valid image MIME type is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!title || title.trim().length < 5) return new Response(JSON.stringify({ success: false, error: "Title must be at least 5 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!description || description.trim().length < 10) return new Response(JSON.stringify({ success: false, error: "Description must be at least 10 characters" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    let imageBuffer: Uint8Array;
    try {
      const raw = atob(image);
      imageBuffer = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) imageBuffer[i] = raw.charCodeAt(i);
    } catch { return new Response(JSON.stringify({ success: false, error: "Invalid image data" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }

    // Step 1: Pre-validate
    const preCheck = await prevalidateImage(imageBuffer);
    if (!preCheck.valid) return new Response(JSON.stringify({ success: false, error: preCheck.reason }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Step 2: Gemini with actual image
    let geminiResult: Record<string, unknown>;
    try { geminiResult = await analyzeWithGemini(imageBuffer, mimeType, title, description); }
    catch (err) { console.error("Gemini analysis failed:", err.message); return new Response(JSON.stringify({ success: false, error: "AI analysis failed. Please retake the photo and try again." }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }

    // Step 3: Post-validate
    const postCheck = validateGeminiResponse(geminiResult);
    if (!postCheck.valid) return new Response(JSON.stringify({ success: false, error: postCheck.reason }), { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    return new Response(JSON.stringify({ success: true, analysis: geminiResult }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("validate-problem-image error:", err);
    return new Response(JSON.stringify({ success: false, error: "An unexpected error occurred. Please try again." }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
