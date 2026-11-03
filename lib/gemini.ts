import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI API KEY is not set environment varaibles");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeWithGemini(
  text: string,
  analysisType: "summary" | "qa" | "sentiment" | "entities" | "extract" = "summary",
) {
  const models = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro"];

  const prompts: Record<string, string> = {
    summary: `Please provide a comprehensive summary of the following document and txt. Include main points, key findings, and conclusions:\n\n${text}`,
    qa: `Based on the following document, generate 5 important questions and their answers:\n\n${text}`,
    sentiment: `Analyze the sentiment and tone of the following document and txt. Provide overall sentiment (positive/negative/neutral) and key emotional tones detected:\n\n${text}`,
    entities: `Extract all named entities (people, organizations, locations, dates, etc.) from the following document:\n\n${text}`,
    extract: `Extract key information from the following document in structured format:\n\n${text}`,
  };

  const prompt = prompts[analysisType] || prompts.summary;
  let lastError: unknown;

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      lastError = error;
      console.warn(`Gemini model ${modelName} failed, trying fallback:`, error);
    }
  }

  console.error("All Gemini model attempts failed:", lastError);
  throw new Error(
    lastError instanceof Error
      ? lastError.message
      : `Could not analyze for ${analysisType}`
  );
}
