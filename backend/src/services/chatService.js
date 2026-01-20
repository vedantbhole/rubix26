import { ai, MODELS } from '../config/gemini.js';

/**
 * Generate a chat response based on plant context and conversation history
 * @param {string} message - Current user message
 * @param {Object} context - Plant context (name, scientific name, etc.)
 * @param {Array} history - Previous conversation history
 * @returns {string} - AI response
 */
export const getChatResponse = async (message, context, history = []) => {
    try {
        const systemPrompt = `You are a helpful, knowledgeable botanical assistant in a digital herbal garden application. 
    Your goal is to help users learn about plants, their medicinal properties, and care instructions.
    
    User Context:
    The user is currently looking at a plant identified as:
    - Common Name: ${context.commonName || 'Unknown'}
    - Scientific Name: ${context.scientificName || 'Unknown'}
    - Probability: ${Math.round((context.score || 0) * 100)}%
    
    Instructions:
    1. Answer the user's question specifically about this plant if applicable.
    2. If the user asks general questions, answer generally but try to tie it back to the identified plant if relevant.
    3. Be concise but informative. Use friendly, encouraging language.
    4. If the identification score is low (< 20%), warn the user that the identification might be inaccurate.
    
    Previous Conversation:
    ${history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}
    `;

        // Combine history and current message for the full prompt context
        // Unified SDK generateContent is stateless unless using startChat, but let's use simple prompt construction for robustness 
        // or use the proper startChat method on the model.

        // Let's use the simple generateContent with the full context included in the prompt
        // This avoids managing session state on the server side complexity for now.

        const fullPrompt = `${systemPrompt}\n\nCurrent User Question: ${message}`;

        const response = await ai.models.generateContent({
            model: MODELS.TEXT,
            contents: fullPrompt,
        });

        return response.candidates?.[0]?.content?.parts?.[0]?.text || "I'm having trouble thinking of a response right now.";

    } catch (error) {
        console.error('Chat Generation Error:', error);
        return "I'm having trouble connecting to my botanical knowledge base right now. Please try again.";
    }
};
