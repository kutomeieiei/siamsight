
import { GoogleGenAI, Chat } from "@google/genai";
import { ItineraryDay, ItineraryResult, GroundingChunk, Locale } from "../types";
import { translations } from '../translations';

export const generateItinerary = async (
  duration: number, 
  interests: string[], 
  province: string, 
  locale: Locale,
  shopNames?: string[]
): Promise<ItineraryResult> => {
  // Initialize AI client right before use
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const tPrompt = (key: string, replacements?: { [key: string]: string | number }) => {
    const localePrompts = translations[locale].prompts as Record<string, string>;
    let text = localePrompts[key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
            text = text.replace(`{{${k}}}`, String(v));
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
    // Switching to gemini-3-flash-preview to avoid strict rate limits of Pro models
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources: GroundingChunk[] = groundingMetadata?.groundingChunks || [];
    
    const text = response.text;
    if (!text) {
      throw new Error("The AI planner returned an empty response.");
    }

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
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    
    // Specific handling for Quota/Rate Limit errors
    if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('quota')) {
      throw new Error(
        locale === 'th' 
          ? "ขณะนี้มีผู้ใช้งานจำนวนมากเกินขีดจำกัดโควตาฟรีของ Google Gemini AI กรุณารอสักครู่ (ประมาณ 1 นาที) แล้วลองใหม่อีกครั้ง" 
          : "The AI is currently receiving too many requests (Gemini Free Tier Quota). Please wait about 60 seconds and try generating your itinerary again."
      );
    }

    if (error instanceof Error) {
        throw error;
    }
    throw new Error("Failed to generate itinerary. The AI planner might be temporarily unavailable. Please try again later.");
  }
};

export const startChatSession = (locale: Locale): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
