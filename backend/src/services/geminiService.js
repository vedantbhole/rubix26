import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { ai, PLANT_SYSTEM_PROMPT, MODELS } from '../config/gemini.js';

/**
 * Helper to retry API calls on 429 (Rate Limit) errors
 * and other transient errors
 * @param {Function} apiCall - Async function to execute
 * @param {number} retries - Number of retries (default 5)
 * @param {number} delay - Initial delay in ms (default 5000)
 */
const generateWithRetry = async (apiCall, retries = 5, delay = 5000) => {
  try {
    return await apiCall();
  } catch (error) {
    const isRateLimit =
      error.status === 429 ||
      error.code === 429 ||
      error.message?.includes('429') ||
      error.message?.includes('RESOURCE_EXHAUSTED');

    if (retries > 0 && isRateLimit) {
      console.log(`⚠️ Rate limit hit. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateWithRetry(apiCall, retries - 1, delay * 2);
    }
    throw error;
  }
};

/**
 * Generate plant information using Google Gemini AI
 * @param {string} plantName - Name of the plant to get information for
 * @returns {Promise<Object>} - Plant information object
 */
export const generatePlantInfo = async (plantName) => {
  try {
    const prompt = `${PLANT_SYSTEM_PROMPT}

---

Please provide comprehensive information about the plant: "${plantName}"

If this is not a real plant or you cannot find reliable information about it, respond with:
{
  "error": true,
  "message": "Could not find reliable information about this plant"
}`;

    // Unified SDK: ai.models.generateContent
    const response = await generateWithRetry(() => ai.models.generateContent({
      model: MODELS.TEXT,
      contents: prompt, // simple text prompt
    }));

    // Accessing content in Unified SDK
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse JSON response
    let plantData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plantData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      throw new Error('Failed to parse AI response');
    }

    // Check for error response
    if (plantData.error) {
      throw new Error(plantData.message || 'Plant not found');
    }

    return {
      ...plantData,
      generatedByAI: true,
      aiModel: MODELS.TEXT
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

/**
 * Generate plant image using Gemini
 * @param {string} plantName - Name of the plant
 * @param {Object} plantData - Existing plant data for context
 * @returns {Promise<Buffer>} - Image buffer (PNG)
 */
export const generatePlantImage = async (plantName, plantData = {}) => {
  try {
    const description = plantData.description || '';
    const scientificName = plantData.scientificName || '';

    const prompt = `Create a beautiful, realistic botanical illustration of the plant "${plantName}" (${scientificName}).
    
Style: Scientific botanical illustration with artistic flair
Details to include:
- Full plant showing leaves, stems, and flowers if applicable
- Natural colors and realistic textures
- Clean white or light cream background
- High detail showing leaf patterns and structure
${description ? `Additional details: ${description.substring(0, 200)}` : ''}

The image should be educational yet visually appealing, suitable for an herbal garden app.`;

    // Unified SDK often supports image generation via specialized models/methods
    // or standard generateContent with proper model config
    const response = await generateWithRetry(() => ai.models.generateContent({
      model: MODELS.IMAGE,
      contents: prompt,
    }));

    // Check availability of image bytes in response
    // Often returned as inlineData in parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        return Buffer.from(imageData, 'base64');
      }
    }

    throw new Error('No image generated in response');
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
};

/**
 * Generate audio narration using local Python script (gTTS)
 * Replaces Gemini TTS to save quota costs and avoid rate limits
 * @param {string} text - Text to convert to speech
 * @param {string} voiceName - Ignored for gTTS (uses default English)
 * @returns {Promise<Buffer>} - Audio buffer (MP3 format)
 */
export const generatePlantAudio = async (text, voiceName = 'Kore') => {
  return new Promise((resolve, reject) => {
    try {
      // Path to python script
      const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'generate_audio.py');

      console.log(`🎤 Spawning Python TTS for text length: ${text.length}`);

      const pythonProcess = spawn('python', [scriptPath, text]);

      let stdoutData = '';
      let stderrData = '';

      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error('Python TTS failed:', stderrData);
          return reject(new Error(`Python script exited with code ${code}: ${stderrData}`));
        }

        // Output should be the filename
        const audioFilePath = stdoutData.trim();

        try {
          // Verify file exists
          await fs.access(audioFilePath);

          // Read the audio file
          const audioBuffer = await fs.readFile(audioFilePath);

          // Delete the temp file to clean up
          // User requested to keep audio files:
          // await fs.unlink(audioFilePath).catch(e => console.error('Failed to delete temp audio:', e));
          console.log(`🎵 Audio file preserved at: ${audioFilePath}`);

          resolve(audioBuffer);
        } catch (fileError) {
          reject(new Error(`Failed to read audio file output: ${fileError.message}`));
        }
      });

    } catch (error) {
      console.error('Audio generation error:', error);
      reject(error);
    }
  });
};

/**
 * Generate a brief audio script for a plant
 * @param {Object} plantData - Existing plant data
 * @returns {Promise<string>} - Audio script text
 */
export const generateAudioScript = async (plantData) => {
  try {
    const prompt = `You are creating a brief, engaging audio narration about a medicinal plant. 
The narration should be 30-60 seconds when read aloud (approximately 75-150 words).
Make it conversational, informative, and suitable for a garden tour audio guide.

Plant: ${plantData.name || plantData.scientificName}
Scientific Name: ${plantData.scientificName}
Brief Description: ${plantData.explanations?.brief || plantData.description}

Generate only the audio script text, nothing else. Start directly with speaking about the plant.`;

    const response = await generateWithRetry(() => ai.models.generateContent({
      model: MODELS.TEXT,
      contents: prompt,
    }));

    return response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

  } catch (error) {
    console.error('Audio script generation error:', error);
    throw error;
  }
};

