import { GoogleGenAI, Type } from "@google/genai";
import { Bar, Deal } from "../types";

// Initialize Gemini Client
// Note: The API key is expected to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GeneratedCampaign {
  title: string;
  description: string;
  suggestedAudience: string;
}

/**
 * Helper to clean Markdown code blocks from JSON strings
 * before parsing.
 */
const cleanJsonString = (str: string): string => {
  if (!str) return "[]";
  // Remove ```json, ```, and extraneous whitespace
  return str.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
};

export const generateCampaignIdeas = async (
  productName: string,
  goal: string,
  barName: string
): Promise<GeneratedCampaign[]> => {
  try {
    const prompt = `
      You are a marketing expert for a bar named "${barName}" in Knoxville.
      Generate 3 creative, catchy, and short marketing campaign ideas for a deal on "${productName}".
      The specific business goal is: "${goal}".
      
      Return the result strictly as a JSON array of objects.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A catchy headline under 30 chars" },
              description: { type: Type.STRING, description: "Persuasive body text under 100 chars" },
              suggestedAudience: { type: Type.STRING, description: "One suggested target demographic e.g. Students, Professionals" }
            },
            required: ["title", "description", "suggestedAudience"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    // Clean potential markdown formatting before parsing
    const cleanedText = cleanJsonString(text);
    const data = JSON.parse(cleanedText) as GeneratedCampaign[];
    return data;

  } catch (error) {
    console.error("Error generating campaign ideas:", error);
    // Fallback data so the UI doesn't break if API fails
    return [
      {
        title: "Flash Sale!",
        description: `Come try our amazing ${productName} today!`,
        suggestedAudience: "Everyone"
      }
    ];
  }
};

export interface NightPlan {
  title: string;
  vibeDescription: string;
  itinerary: {
    barName: string;
    reason: string;
    suggestedActivity: string;
  }[];
  estimatedCost: string;
}

export const planNightOut = async (
  userQuery: string,
  availableBars: Bar[],
  activeDeals: Deal[]
): Promise<NightPlan | null> => {
  try {
    // Simplify data for prompt to save tokens
    const barsContext = availableBars.map(b => `${b.name} (${b.vibe}, ${b.tags.join(', ')})`).join('\n');
    const dealsContext = activeDeals.map(d => `${d.title} at ${d.barName}: ${d.description}`).join('\n');

    const prompt = `
      You are the "KnoxNights Concierge". Plan a night out in Knoxville based on this user request: "${userQuery}".
      
      Here are the available bars:
      ${barsContext}

      Here are active deals:
      ${dealsContext}

      Create a coherent itinerary of 2-3 stops. Pick bars that match the user's request (vibe, tags).
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "A fun title for the night (e.g. 'Chill Thursday')" },
            vibeDescription: { type: Type.STRING, description: "Short summary of the vibe" },
            estimatedCost: { type: Type.STRING, description: "Estimate cost e.g. '$$' or '$30-50'" },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  barName: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "Why this bar fits the plan" },
                  suggestedActivity: { type: Type.STRING, description: "What to do/drink there" }
                },
                required: ["barName", "reason", "suggestedActivity"]
              }
            }
          },
          required: ["title", "vibeDescription", "itinerary", "estimatedCost"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const cleanedText = cleanJsonString(text);
    return JSON.parse(cleanedText) as NightPlan;

  } catch (error) {
    console.error("Error planning night:", error);
    return null;
  }
}