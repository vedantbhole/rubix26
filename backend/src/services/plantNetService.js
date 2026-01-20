import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Helper to clean up file after use
const cleanupFile = async (filePath) => {
    try {
        await fs.promises.unlink(filePath);
    } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
    }
};

/**
 * Identify a plant from an image file using PlantNet API
 * @param {string} filePath - Path to the image file
 * @param {string} organ - Organ type (leaf, flower, etc.)
 * @returns {Object} - PlantNet identification results
 */
export const identifyPlant = async (filePath, organ = 'auto') => {
    const apiKey = process.env.PLANTNET_API_KEY;
    if (!apiKey) {
        throw new Error('PLANTNET_API_KEY is not defined in environment variables');
    }

    const formData = new FormData();
    formData.append('images', fs.createReadStream(filePath));
    formData.append('organs', organ);

    const project = 'all'; // General flora

    try {
        console.log(`🌿 Sending image to PlantNet API (Project: ${project})...`);

        const response = await axios.post(
            `https://my-api.plantnet.org/v2/identify/${project}?api-key=${apiKey}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                }
            }
        );

        console.log(`✅ PlantNet Response Status: ${response.status}`);

        return {
            success: true,
            bestMatch: response.data.results[0], // Most likely match
            results: response.data.results.slice(0, 5) // Top 5 matches
        };

    } catch (error) {
        console.error('PlantNet API Error:', error.response?.data || error.message);

        // Extract meaningful error message
        const errorMsg = error.response?.data?.message || error.message || 'Failed to identify plant';

        return {
            success: false,
            error: errorMsg
        };
    } finally {
        // Clean up uploaded file
        await cleanupFile(filePath);
    }
};
