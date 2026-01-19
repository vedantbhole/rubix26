import express from 'express';
import { 
  getPlantByName, 
  getAllPlants, 
  upsertPlant, 
  addMediaToPlant 
} from '../services/plantService.js';
import { generateAudioScript } from '../services/geminiService.js';

const router = express.Router();

/**
 * GET /api/plants
 * List all plants with pagination and optional search
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, search = '' } = req.query;
    
    const result = await getAllPlants({
      limit: parseInt(limit),
      skip: parseInt(skip),
      search
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/plants/:name
 * Get plant by name with cache-first strategy
 * - If found in DB, returns cached data
 * - If not found, generates via AI, saves to DB, returns data
 */
router.get('/:name', async (req, res, next) => {
  try {
    const { name } = req.params;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Plant name is required'
      });
    }

    const result = await getPlantByName(name);
    res.json(result);

  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('Could not find')) {
      return res.status(404).json({
        success: false,
        error: `Could not find information about "${req.params.name}"`
      });
    }
    next(error);
  }
});

/**
 * POST /api/plants
 * Create or update a plant manually
 */
router.post('/', async (req, res, next) => {
  try {
    const plantData = req.body;

    if (!plantData.name) {
      return res.status(400).json({
        success: false,
        error: 'Plant name is required'
      });
    }

    const result = await upsertPlant(plantData);
    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/plants/:name/media
 * Add media reference to a plant
 */
router.post('/:name/media', async (req, res, next) => {
  try {
    const { name } = req.params;
    const mediaData = req.body;

    if (!mediaData.type || !mediaData.fileId) {
      return res.status(400).json({
        success: false,
        error: 'Media type and fileId are required'
      });
    }

    const result = await addMediaToPlant(name, mediaData);
    res.json(result);

  } catch (error) {
    if (error.message === 'Plant not found') {
      return res.status(404).json({
        success: false,
        error: 'Plant not found'
      });
    }
    next(error);
  }
});

/**
 * GET /api/plants/:name/audio-script
 * Generate an audio script for the plant
 */
router.get('/:name/audio-script', async (req, res, next) => {
  try {
    const { name } = req.params;
    
    // First get the plant data
    const plantResult = await getPlantByName(name);
    
    // Generate audio script
    const script = await generateAudioScript(plantResult.data);

    res.json({
      success: true,
      plantName: name,
      script
    });

  } catch (error) {
    next(error);
  }
});

export default router;
