
import { GoogleGenAI, Chat } from "@google/genai";
import { ItineraryDay, GroundingChunk, Locale } from "../types";
import { translations } from '../translations';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateItinerary = async (duration: number, interests: string[], locale: Locale): Promise<{ itinerary: ItineraryDay[], sources: GroundingChunk[] }> => {
  const t = (key: string, replacements?: { [key: string]: string | number }) => {
    let text = translations[locale].prompts[key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
            text = text.replace(`{{${key}}}`, String(value));
        });
    }
    return text;
  };

  const interestsText = interests.join(', ');

  const prompt = t('itinerary', { duration, interests: interestsText });

  try {
    // FIX: Switched to 'gemini-3-pro-preview' for the complex reasoning task of itinerary generation.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    
    // Extract sources from grounding metadata
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks || [];
    
    // Extract and parse JSON from markdown code block
    const text = response.text;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    
    let parsedJson;
    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedJson = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from model response:", e);
        throw new Error("The AI planner returned an invalid format. Please try again.");
      }
    } else {
      // Fallback for when the model doesn't use a code block but returns valid JSON
      try {
        parsedJson = JSON.parse(text);
      } catch (e) {
        console.error("Could not find or parse JSON in the model response:", text);
        throw new Error("The AI planner gave an unexpected response. Please try generating again.");
      }
    }

    if (!parsedJson || !parsedJson.itinerary) {
      throw new Error("Itinerary data not found in the model's response.");
    }
    
    return { itinerary: parsedJson.itinerary, sources };
  } catch (error) {
    console.error("Error generating itinerary:", error);
    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to generate itinerary. The AI planner might be temporarily unavailable. Please try again later.");
  }
};

export const startChatSession = (locale: Locale): Chat => {
  const systemInstruction = translations[locale].prompts.chatbotSystem;
  
  // FIX: Switched to 'gemini-3-flash-preview' for basic conversational tasks.
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      tools: [{googleSearch: {}}]
    }
  });
  return chat;
};
