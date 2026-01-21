
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateUnderwaterImage = async (prompt: string, baseImageBase64?: string): Promise<string | null> => {
  const ai = getAIClient();
  const model = 'gemini-2.5-flash-image';

  const parts: any[] = [{ text: prompt }];
  
  if (baseImageBase64) {
    // If we have a base image, it's an "edit" operation
    parts.unshift({
      inlineData: {
        data: baseImageBase64.split(',')[1],
        mimeType: 'image/png'
      }
    });
  } else {
    // If no base image, prepend default underwater styling to guide the model
    parts[0].text = `Underwater 3D environment: ${prompt}. High quality, realistic caustics, volumetric light shafts, deep ocean teal and blue palette, 8k resolution, cinematic lighting.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        // This usually means API key issues in certain contexts
        throw new Error("API_KEY_ERROR");
    }
    return null;
  }
};

export const getTechnicalAdvice = async (context: string): Promise<string> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert 3D Graphic Designer. Provide specific technical guidance for underwater web backgrounds regarding: ${context}. Keep it professional, concise, and focused on web optimization (Three.js/WebGL).`,
    });
    return response.text || "No advice available at this time.";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "Failed to fetch technical design advice.";
  }
};
