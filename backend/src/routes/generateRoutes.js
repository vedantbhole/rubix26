import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import {
  generatePlantImage,
  generatePlantAudio,
  generateAudioScript
} from '../services/geminiService.js';
import { getPlantByName } from '../services/plantService.js';
import { uploadFile, getMediaType } from '../services/mediaService.js';
import { addMediaToPlant } from '../services/plantService.js';
import { storage, BUCKET_ID, ID, getFilePreviewUrl } from '../config/appwrite.js';
import { InputFile } from 'node-appwrite/file';

const router = express.Router();

/**
 * POST /api/generate/image/:plantName
 * Generate an AI image for a plant and optionally save to Appwrite
 */
router.post('/image/:plantName', async (req, res, next) => {
  try {
    const { plantName } = req.params;
    const { saveToAppwrite = false, caption = '' } = req.body;

    // Get plant data for context
    let plantData = {};
    try {
      const result = await getPlantByName(plantName);
      plantData = result.data;
    } catch (e) {
      // Plant not found, generate image anyway
    }

    // Generate image
    console.log(`🎨 Generating image for plant: ${plantName}`);
    const imageBuffer = await generatePlantImage(plantName, plantData);

    // Optionally save to Appwrite
    if (saveToAppwrite && BUCKET_ID) {
      try {
        const inputFile = InputFile.fromBuffer(
          imageBuffer,
          `${plantName.toLowerCase().replace(/\s+/g, '-')}-ai-generated.png`
        );

        const uploadResult = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          inputFile
        );

        const fileUrl = getFilePreviewUrl(uploadResult.$id);

        // Associate with plant if it exists
        if (plantData.name) {
          await addMediaToPlant(plantName, {
            type: 'image',
            fileId: uploadResult.$id,
            url: fileUrl,
            caption: caption || 'AI-generated botanical illustration',
            mimeType: 'image/png'
          });
        }

        return res.json({
          success: true,
          message: 'Image generated and saved to Appwrite',
          data: {
            fileId: uploadResult.$id,
            url: fileUrl,
            plantName
          }
        });
      } catch (uploadError) {
        console.error('Failed to upload to Appwrite:', uploadError);
        // Fall through to return base64 if upload fails
      }
    }

    // Return image as base64
    res.json({
      success: true,
      message: 'Image generated successfully',
      data: {
        plantName,
        base64: imageBuffer.toString('base64'),
        mimeType: 'image/png'
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/generate/audio/:plantName
 * Generate TTS audio narration for a plant
 */
router.post('/audio/:plantName', async (req, res, next) => {
  try {
    const { plantName } = req.params;
    const {
      voiceName = 'Kore',
      saveToAppwrite = true, // Default to TRUE to ensure caching
      customText = null
    } = req.body;

    // 1. Get plant data (Cache-first: DB -> AI -> DB)
    // This handles the "if data avail return it, else generate & save" logic
    let plantData = {};
    let audioText = customText;

    if (!audioText) {
      try {
        console.log(`🔍 Fetching data for audio generation: ${plantName}`);

        // Check DB first
        const result = await getPlantByName(plantName);
        plantData = result.data;

        // CHECK FOR EXISTING AUDIO (Cache Hit)
        // If we have audio in the database, return it directly
        if (plantData.media && plantData.media.audio && plantData.media.audio.length > 0) {
          console.log(`🔊 Audio already exists for ${plantName}, returning from cache.`);
          const existingAudio = plantData.media.audio[plantData.media.audio.length - 1]; // Get latest

          // SYNC LOCAL FILE: Check if file exists locally, if not download from Appwrite
          try {
            const scriptDir = path.join(process.cwd(), 'src', 'scripts');
            const filename = `${plantName.toLowerCase().replace(/\s+/g, '-')}-narration.mp3`;
            const localFilePath = path.join(scriptDir, filename);

            try {
              await fs.access(localFilePath);
              console.log(`✅ Local audio file exists: ${localFilePath}`);
            } catch (e) {
              // File doesn't exist locally, download it
              console.log(`📥 Local audio missing, downloading from Appwrite...`);
              if (BUCKET_ID && existingAudio.fileId) {
                const fileBuffer = await storage.getFileDownload(BUCKET_ID, existingAudio.fileId);
                await fs.writeFile(localFilePath, Buffer.from(fileBuffer));
                
                console.log(`💾 Downloaded and saved audio to: ${localFilePath}`);
              }
            }
          } catch (syncError) {
            console.error('⚠️ Failed to sync local audio file:', syncError);
            // Verify we continue even if sync fails
          }

          return res.json({
            success: true,
            message: 'Audio retrieved from cache',
            data: {
              plantName,
              fileId: existingAudio.fileId,
              url: existingAudio.url,
              transcript: plantData.explanations?.audioTranscript || customText || '',
              voiceName,
              cached: true
            }
          });
        }

        // Generate script from the fetched/generated plant data
        audioText = await generateAudioScript(plantData);
      } catch (error) {
        console.error('Failed to get plant data for audio:', error);
        throw new Error(`Could not generate audio: Failed to find or generate information for "${plantName}"`);
      }
    }

    // 2. Generate audio
    console.log(`🔊 Generating audio for plant: ${plantName}`);
    const audioBuffer = await generatePlantAudio(audioText, voiceName);

    // 3. Optionally save to Appwrite
    if (saveToAppwrite && BUCKET_ID) {
      console.log(`💾 Attempting to save audio to Appwrite (Bucket: ${BUCKET_ID})`);
      try {
        const inputFile = InputFile.fromBuffer(
          audioBuffer,
          `${plantName.toLowerCase().replace(/\s+/g, '-')}-narration.mp3`
        );

        const uploadResult = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          inputFile
        );

        const fileUrl = getFilePreviewUrl(uploadResult.$id);
        console.log(`✅ Audio uploaded to Appwrite: ${fileUrl}`);

        // Associate with plant if we have plant data
        if (plantData && plantData.name) {
          console.log(`🔗 Linking audio to plant ${plantName} in database...`);
          await addMediaToPlant(plantName, {
            type: 'audio',
            fileId: uploadResult.$id,
            url: fileUrl,
            caption: 'AI-generated audio narration',
            mimeType: 'audio/mpeg'
          });
          console.log(`✅ Database updated with audio URL.`);

          // Also save the transcript if we have plant object (this part is fine)
          if (!plantData.explanations) {
            plantData.explanations = {};
          }
          plantData.explanations.audioTranscript = audioText;
        } else {
          console.warn(`⚠️ Could not link audio to plant: plantData.name is missing.`);
        }

        return res.json({
          success: true,
          message: 'Audio generated and saved to Appwrite',
          data: {
            fileId: uploadResult.$id,
            url: fileUrl,
            plantName,
            transcript: audioText,
            voiceName
          }
        });
      } catch (uploadError) {
        console.error('Failed to upload to Appwrite:', uploadError);
        // Fall through to return base64
      }
    }

    // Return audio as base64
    res.json({
      success: true,
      message: 'Audio generated successfully',
      data: {
        plantName,
        base64: audioBuffer.toString('base64'),
        mimeType: 'audio/mpeg',
        transcript: audioText,
        voiceName
      }
    });

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/generate/all/:plantName
 * Generate both image and audio for a plant
 */
router.post('/all/:plantName', async (req, res, next) => {
  try {
    const { plantName } = req.params;
    const {
      voiceName = 'Kore',
      saveToAppwrite = false
    } = req.body;

    // Get or generate plant data first
    const plantResult = await getPlantByName(plantName);
    const plantData = plantResult.data;

    // Generate image and audio in parallel
    console.log(`🎨🔊 Generating image and audio for plant: ${plantName}`);

    const audioText = await generateAudioScript(plantData);

    const [imageBuffer, audioBuffer] = await Promise.all([
      generatePlantImage(plantName, plantData),
      generatePlantAudio(audioText, voiceName)
    ]);

    const result = {
      success: true,
      plantName,
      plant: plantData,
      image: {
        base64: imageBuffer.toString('base64'),
        mimeType: 'image/png'
      },
      audio: {
        base64: audioBuffer.toString('base64'),
        mimeType: 'audio/mpeg',
        transcript: audioText,
        voiceName
      }
    };

    // Save to Appwrite if requested
    if (saveToAppwrite && BUCKET_ID) {
      try {
        // Upload image
        const imageFile = InputFile.fromBuffer(
          imageBuffer,
          `${plantName.toLowerCase().replace(/\s+/g, '-')}-ai-image.png`
        );
        const imageUpload = await storage.createFile(BUCKET_ID, ID.unique(), imageFile);
        const imageUrl = getFilePreviewUrl(imageUpload.$id);

        await addMediaToPlant(plantName, {
          type: 'image',
          fileId: imageUpload.$id,
          url: imageUrl,
          caption: 'AI-generated botanical illustration',
          mimeType: 'image/png'
        });

        result.image.fileId = imageUpload.$id;
        result.image.url = imageUrl;

        // Upload audio
        const audioFile = InputFile.fromBuffer(
          audioBuffer,
          `${plantName.toLowerCase().replace(/\s+/g, '-')}-narration.mp3`
        );
        const audioUpload = await storage.createFile(BUCKET_ID, ID.unique(), audioFile);
        const audioUrl = getFilePreviewUrl(audioUpload.$id);

        await addMediaToPlant(plantName, {
          type: 'audio',
          fileId: audioUpload.$id,
          url: audioUrl,
          caption: 'AI-generated audio narration',
          mimeType: 'audio/mpeg'
        });

        result.audio.fileId = audioUpload.$id;
        result.audio.url = audioUrl;

        result.message = 'All media generated and saved to Appwrite';
      } catch (uploadError) {
        console.error('Failed to upload to Appwrite:', uploadError);
        result.message = 'Media generated but failed to save to Appwrite';
      }
    } else {
      result.message = 'All media generated successfully';
    }

    res.json(result);

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/generate/voices
 * Get available TTS voice options
 */
router.get('/voices', (req, res) => {
  res.json({
    success: true,
    voices: [
      { name: 'Default', description: 'Standard Python TTS Voice' }
    ]
  });
});

export default router;
