import { GoogleGenAI, Type } from "@google/genai";
import { Template, Partner } from '../types';
import { MOCK_PARTNERS } from '../constants';

// This `declare` block informs TypeScript that the `process` object is globally available.
// Vite's `define` configuration will replace these variables with their actual values
// at build time, preventing runtime errors.
declare var process: {
  env: {
    // This variable is provided by the execution environment, not Vite's define config.
    API_KEY: string;
    // These variables are injected by Vite's define config.
    VITE_AI_PROVIDER: string;
    VITE_AI_GATEWAY_URL: string;
    VITE_AI_GATEWAY_API_KEY: string;
    VITE_AI_GATEWAY_MODEL: string;
  }
};

const GEMINI_MODEL = 'gemini-2.5-flash';

// Read configuration from the process.env object. Vite's `define` config replaces these
// variable names with their literal string values during the build.
const aiProvider = process.env.VITE_AI_PROVIDER;
const gatewayUrl = process.env.VITE_AI_GATEWAY_URL;
const gatewayApiKey = process.env.VITE_AI_GATEWAY_API_KEY;
const gatewayModel = process.env.VITE_AI_GATEWAY_MODEL;

// Per project guidelines, the Gemini API key MUST come exclusively from the execution
// environment's `process.env.API_KEY`.
const geminiApiKey = process.env.API_KEY;

// --- Startup Logging: Log the configuration as soon as the module is loaded ---
console.groupCollapsed('[AI Service] Configuration Loaded');
console.info(`AI Provider: %c${aiProvider}`, 'font-weight: bold;');
if (aiProvider === 'GATEWAY') {
    console.log(`Gateway Base URL: ${gatewayUrl || 'Not Set'}`);
    console.info(`(Note: The final URL will be constructed as \`{Base URL}/{Model}/v1/chat/completions\`)`);
    console.log(`Gateway Model: ${gatewayModel || `(default: ${GEMINI_MODEL})`}`);
    console.log(`Gateway API Key Set: %c${!!gatewayApiKey}`, `font-weight: bold; color: ${!!gatewayApiKey ? 'green' : 'red'};`);
} else {
     console.log(`Gemini API Key Set: %c${!!geminiApiKey}`, `font-weight: bold; color: ${!!geminiApiKey ? 'green' : 'red'};`);
}
console.groupEnd();

if (aiProvider === 'GATEWAY' && (!gatewayUrl || !gatewayApiKey)) {
    console.error('[AI Service] CRITICAL: AI Gateway is the configured provider, but VITE_AI_GATEWAY_URL or VITE_AI_GATEWAY_API_KEY is missing in your .env file.');
} else if (aiProvider === 'GEMINI' && !geminiApiKey) {
    console.warn('[AI Service] WARNING: Gemini is the configured provider, but the API_KEY was not found in the environment. AI features will use mock data.');
}
// --- End of Startup Logging ---


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
    
    if (templates.length === 0) return null;

    const preferredTemplate = templates.find(t => t.name.toLowerCase().includes('invoice') || t.name.toLowerCase().includes('standard'));
    if (preferredTemplate) {
        return preferredTemplate.id;
    }

    return templates[Math.floor(Math.random() * templates.length)].id;
}

/**
 * Internal helper to make a POST request to the AI Gateway, following an OpenAI-compatible structure.
 */
const _callAiGateway = async (prompt: string): Promise<any> => {
    if (!gatewayUrl || !gatewayApiKey) {
        throw new Error('AI Gateway is configured, but URL or API key is missing.');
    }
    
    const modelToUse = gatewayModel || GEMINI_MODEL;
    const fullGatewayUrl = `${gatewayUrl}/${modelToUse}/v1/chat/completions`;

    const requestBody = {
        model: modelToUse,
        messages: [
            { role: 'system', content: 'You are a helpful assistant that provides responses in JSON format.' },
            { role: 'user', content: prompt }
        ],
        stream: false,
        response_format: { type: "json_object" }, // Ask for JSON output
    };
    
    console.log(`[AI Service] Sending request to Gateway: %c${fullGatewayUrl}`, 'font-weight: bold;');

    const response = await fetch(fullGatewayUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${gatewayApiKey}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Gateway request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        // The content from OpenAI-compatible gateways is often a stringified JSON.
        return JSON.parse(data.choices[0].message.content);
    }
    
    throw new Error('The AI Gateway response did not contain the expected content.');
};


export const findTemplatesWithAI = async (
  description: string,
  existingTemplates: Template[]
): Promise<string[]> => {
  const templateNames = existingTemplates.map(t => t.name).join(', ');
  const prompt = `From the following list of templates, which are most relevant to the document description provided? Respond with a JSON object containing a single key "suggestions" which is an array of up to 3 template names. List: [${templateNames}]. Description: "${description}".`;

  // --- Route to the appropriate AI provider ---
  if (aiProvider === 'GATEWAY') {
      try {
        console.log('[AI Service] Using AI Gateway for template search.');
        const result = await _callAiGateway(prompt);
        if (result && result.suggestions && Array.isArray(result.suggestions)) {
            return result.suggestions;
        }
        return [];
      } catch (error) {
          console.error("Error calling AI Gateway:", error);
          // Fallback for gateway failure
          return existingTemplates.slice(0, 2).map(t => t.name);
      }
  }

  // --- Default to GEMINI provider ---
  if (!geminiApiKey) {
    console.warn("API_KEY environment variable not set. Returning mock data for template search.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    const keywords = description.toLowerCase().split(' ');
    const matched = existingTemplates.filter(t => keywords.some(kw => t.name.toLowerCase().includes(kw)));
    return matched.length > 0 ? matched.map(t => t.name) : existingTemplates.slice(0, 2).map(t => t.name);
  }

  try {
    console.log('[AI Service] Using direct Gemini API for template search.');
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
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
    return existingTemplates.slice(0, 2).map(t => t.name);
  }
};
