import { GoogleGenAI, Chat } from "@google/genai";
import { ItineraryDay, ItineraryResult, GroundingChunk, Locale } from "../types";
import { translations } from '../translations';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateItinerary = async (
  duration: number, 
  interests: string[], 
  province: string, 
  locale: Locale,
  shopNames?: string[]
): Promise<ItineraryResult> => {
  const tPrompt = (key: string, replacements?: { [key: string]: string | number }) => {
    let text = translations[locale].prompts[key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([key, value]) => {
            text = text.replace(`{{${key}}}`, String(value));
        });
    }
    return text;
  };

  const interestsText = interests.join(', ');
  
  let shopPrompt = "";
  if (shopNames && shopNames.length > 0) {
    const list = shopNames.join('", "');
    shopPrompt = locale === 'th' 
      ? `ผู้เดินทางต้องการไปแวะชมร้านค้าเหล่านี้: "${list}" กรุณารวมการแวะร้านเหล่านี้ลงในแผนการเดินทางด้วย หากร้านเหล่านี้อยู่ไกลกันเกินไปหรือจำนวนร้านเยอะเกินกว่าจะเที่ยวได้ในเวลาที่กำหนด กรุณาระบุคำเตือนในช่อง feasibility_warning ของ JSON ด้วย`
      : `The traveler specifically wants to visit these shops: "${list}". Please ensure these shop visits are included as activities in the itinerary. If these shops are too far apart or too numerous for the given trip duration, please provide a clear warning in the "feasibility_warning" field of the JSON response.`;
  }

  const prompt = tPrompt('itinerary', { 
    duration, 
    interests: interestsText, 
    province: province || (locale === 'th' ? 'ประเทศไทย' : 'Thailand'),
    shopPrompt
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks || [];
    
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
    
    return { 
      itinerary: parsedJson.itinerary, 
      total_estimated_cost: parsedJson.total_estimated_cost || 0,
      currency: parsedJson.currency || 'THB',
      cost_breakdown: parsedJson.cost_breakdown || { accommodation: 0, food: 0, transport: 0, activities: 0 },
      sources,
      feasibility_warning: parsedJson.feasibility_warning || undefined
    };
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
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      tools: [{googleSearch: {}}]
    }
  });
  return chat;
};

export const startLearningSession = (locale: Locale): Chat => {
  const systemInstruction = translations[locale].prompts.learningSystem;
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: systemInstruction,
      tools: [{googleSearch: {}}]
    }
  });
  return chat;
};