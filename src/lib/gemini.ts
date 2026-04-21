import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface WordAnalysis {
  meaning: string;
  breakdown: string;
  origin: string;
  example: string;
  synonyms: string[];
  memoryTrick: string;
}

export async function analyzeWord(word: string): Promise<WordAnalysis> {
  const prompt = `Analyze the English word "${word}". 
Respond ONLY in Hinglish (a mix of Hindi and English) which is easy for beginners to understand.
Be engaging and use the following format for fields:
- meaning: Simple and clear Hinglish meaning.
- breakdown: Break into prefix, root, suffix and explain in Hinglish.
- origin: Explain the word's origin (Latin/Greek etc) in Hinglish.
- example: One easy sentence using the word in Hinglish.
- synonyms: 2-3 similar words.
- memoryTrick: A simple story or trick to remember the word.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          meaning: { type: Type.STRING },
          breakdown: { type: Type.STRING },
          origin: { type: Type.STRING },
          example: { type: Type.STRING },
          synonyms: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          memoryTrick: { type: Type.STRING }
        },
        required: ["meaning", "breakdown", "origin", "example", "synonyms", "memoryTrick"]
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text.trim()) as WordAnalysis;
}
