import { GoogleGenAI, Type } from "@google/genai";
import { AIHabitSuggestion } from "../types";

export const suggestHabitsFromGoal = async (goal: string): Promise<AIHabitSuggestion[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Suggest 3 specific, trackable habits for someone whose goal is: "${goal}". 
      Make them simple and actionable.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "A short, catchy title for the habit (e.g., 'Drink Water')" },
              category: { 
                type: Type.STRING, 
                enum: ['Health', 'Productivity', 'Mindfulness', 'Learning', 'Social', 'Other'],
                description: "The category of the habit" 
              },
              reason: { type: Type.STRING, description: "Brief reason why this helps the goal" }
            },
            required: ["title", "category", "reason"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    return JSON.parse(text) as AIHabitSuggestion[];
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return []; // Return empty on error to avoid crashing UI
  }
};