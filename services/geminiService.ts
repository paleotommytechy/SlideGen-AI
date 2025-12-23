import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PresentationConfig, PresentationData } from "../types";

// Define the response schema strictly to ensure valid JSON output for the PPT generator
const slideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The headline title of the slide." },
    bulletPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 concise bullet points summarizing the slide content. Do not use full sentences.",
    },
    speakerNotes: { type: Type.STRING, description: "Detailed script for the presenter to say while showing this slide." },
    imageDescription: { type: Type.STRING, description: "A detailed visual description for an AI image generator to create a relevant image (e.g., 'photorealistic wide shot of a futuristic eco-friendly city, sunny day')." },
    citations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "1-2 brief source citations or references if applicable (e.g. 'Source: World Energy Report 2024')." },
  },
  required: ["title", "bulletPoints", "speakerNotes", "imageDescription"],
};

const presentationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The main title of the presentation." },
    subtitle: { type: Type.STRING, description: "A catchy subtitle or tagline." },
    slides: {
      type: Type.ARRAY,
      items: slideSchema,
      description: "The list of slides for the presentation.",
    },
  },
  required: ["title", "subtitle", "slides"],
};

export const generatePresentationContent = async (config: PresentationConfig): Promise<PresentationData> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a detailed PowerPoint presentation outline.
    
    Topic: ${config.topic}
    Target Audience: ${config.audience}
    Tone: ${config.tone}
    Approximate Slide Count: ${config.slideCount}
    Include Citations: ${config.includeCitations ? 'Yes' : 'No'}
    
    Requirements:
    1. Structure the content logically (Introduction -> Main Points -> Conclusion).
    2. Ensure bullet points are concise and scannable.
    3. Speaker notes should be conversational and add depth to the slide content.
    4. Image descriptions MUST be visually descriptive for an AI image generator. Avoid abstract concepts; describe physical scenes, objects, or people.
    5. The content must be high quality and factual.
    ${config.includeCitations ? '6. Provide real or plausible citations for factual claims in the citations field.' : ''}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: presentationSchema,
        systemInstruction: "You are an expert presentation designer and public speaking coach. You create professional, structured, and engaging presentations.",
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from AI.");
    }

    const data = JSON.parse(text) as PresentationData;
    
    // Safety check to limit slides if AI goes overboard, or pad if too few (though schema usually handles this)
    if (data.slides.length > 20) {
      data.slides = data.slides.slice(0, 20);
    }

    return data;
  } catch (error) {
    console.error("Error generating presentation:", error);
    throw error;
  }
};