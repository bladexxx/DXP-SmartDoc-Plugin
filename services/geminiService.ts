import { GoogleGenAI, Type } from "@google/genai";
import { Template, Partner } from '../types';
import { MOCK_PARTNERS } from '../constants';

export const identifyPartnerFromPdf = async (file: File): Promise<Partner | null> => {
  console.log(`Simulating AI partner identification for ${file.name}`);
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

  // 80% chance of success for demo purposes
  if (Math.random() < 0.8) {
    const identifiedPartner = MOCK_PARTNERS[Math.floor(Math.random() * MOCK_PARTNERS.length)];
    console.log("Partner identified:", identifiedPartner);
    return identifiedPartner;
  }
  
  console.log("Could not identify partner automatically.");
  return null;
};


export const suggestTemplateForPartner = async (partner: Partner, templates: Template[]): Promise<string | null> => {
    console.log(`Simulating AI template suggestion for ${partner.name}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock logic: prefer templates with "invoice" or "standard" in the name, otherwise pick a random one
    if (templates.length === 0) return null;

    const preferredTemplate = templates.find(t => t.name.toLowerCase().includes('invoice') || t.name.toLowerCase().includes('standard'));
    if (preferredTemplate) {
        return preferredTemplate.id;
    }

    return templates[Math.floor(Math.random() * templates.length)].id;
}


export const findTemplatesWithAI = async (
  description: string,
  existingTemplates: Template[]
): Promise<string[]> => {
  // This check is for the demo environment. In a real environment, the API key would be set.
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Returning mock data.");
    // Simulate API delay and return suggestions based on keywords
    await new Promise(resolve => setTimeout(resolve, 1000));
    const keywords = description.toLowerCase().split(' ');
    const matched = existingTemplates.filter(t => keywords.some(kw => t.name.toLowerCase().includes(kw)));
    return matched.length > 0 ? matched.map(t => t.name) : [existingTemplates[0].name, existingTemplates[1].name];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const templateNames = existingTemplates.map(t => t.name).join(', ');

    const prompt = `From the following list of templates, which are most relevant to the document description provided? List: [${templateNames}]. Description: "${description}". Suggest up to 3 template names.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                            description: 'A suggested template name.'
                        }
                    }
                }
            },
        },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && result.suggestions && Array.isArray(result.suggestions)) {
      return result.suggestions;
    }
    
    return [];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Fallback to simple matching on error
    return existingTemplates.slice(0, 2).map(t => t.name);
  }
};