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
  // Always use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
    const response = await ai.models.generateContent({
      // Switched to gemini-flash-lite-latest for maximum free-tier headroom
      model: "gemini-flash-lite-latest", 
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
        throw new Error("The AI planner returned an invalid format.");
      }
    } else {
      try {
        parsedJson = JSON.parse(text);
      } catch (e) {
        throw new Error("The AI planner gave an unexpected response.");
      }
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
    if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('quota')) {
      throw new Error(
        locale === 'th' 
          ? "โควตาฟรีชั่วคราวเต็มแล้ว (429) กรุณารอ 60 วินาทีแล้วลองใหม่" 
          : "Free quota exceeded (429). Please wait 60 seconds and try again."
      );
    }
    throw error;
  }
};

export const startChatSession = (locale: Locale): Chat => {
  // Always use process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = translations[locale].prompts.chatbotSystem;
  
  return ai.chats.create({
    model: 'gemini-flash-lite-latest', // Consistent use of Lite for high availability
    config: {
      systemInstruction: systemInstruction,
      tools: [{googleSearch: {}}]
    }
  });
};

export const startLearningSession = (locale: Locale): Chat => {
  // Always use process.env.API_KEY directly for initialization
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = translations[locale].prompts.learningSystem;
  
  return ai.chats.create({
    model: 'gemini-flash-lite-latest', // Consistent use of Lite for high availability
    config: {
      systemInstruction: systemInstruction,
      tools: [{googleSearch: {}}]
    }
  });
};