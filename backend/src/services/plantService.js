import Plant from '../models/Plant.js';
import { generatePlantInfo } from './geminiService.js';

/**
 * Get plant information with cache-first strategy
 * Flow: Check DB → If found, return cached → If not, call AI → Save to DB → Return
 * 
 * @param {string} plantName - Name of the plant to look up
 * @returns {Promise<Object>} - Plant data
 */
export const getPlantByName = async (plantName) => {
  const normalizedName = plantName.toLowerCase().trim();

  try {
    // Step 1: Check if plant exists in database
    let plant = await Plant.findByName(normalizedName);

    if (plant) {
      // Cache hit - return existing data
      console.log(`📦 Cache hit for plant: ${normalizedName}`);
      
      // Increment view count (async, don't wait)
      plant.incrementViews().catch(err => 
        console.error('Failed to increment views:', err)
      );

      return {
        success: true,
        source: 'database',
        data: plant
      };
    }

    // Step 2: Cache miss - generate with AI
    console.log(`🤖 Cache miss for plant: ${normalizedName}, generating with AI...`);
    
    const aiData = await generatePlantInfo(normalizedName);

    // Step 3: Save to database
    plant = new Plant({
      name: normalizedName,
      ...aiData
    });

    await plant.save();
    console.log(`💾 Saved new plant to database: ${normalizedName}`);

    return {
      success: true,
      source: 'ai-generated',
      data: plant
    };

  } catch (error) {
    console.error(`Error fetching plant ${plantName}:`, error);
    throw error;
  }
};

/**
 * Get all plants from database
 * @param {Object} options - Query options (limit, skip, search)
 * @returns {Promise<Object>} - Plants list with pagination
 */
export const getAllPlants = async (options = {}) => {
  const { limit = 20, skip = 0, search = '' } = options;

  try {
    let query = {};

    // Add text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    const [plants, total] = await Promise.all([
      Plant.find(query)
        .sort({ viewCount: -1, createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Plant.countDocuments(query)
    ]);

    return {
      success: true,
      data: plants,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + plants.length < total
      }
    };

  } catch (error) {
    console.error('Error fetching plants:', error);
    throw error;
  }
};

/**
 * Update plant with additional media
 * @param {string} plantName - Name of the plant
 * @param {Object} mediaData - Media data to add
 * @returns {Promise<Object>} - Updated plant
 */
export const addMediaToPlant = async (plantName, mediaData) => {
  const normalizedName = plantName.toLowerCase().trim();

  try {
    const plant = await Plant.findByName(normalizedName);
    
    if (!plant) {
      throw new Error('Plant not found');
    }

    // Add media based on type
    const { type, fileId, url, caption, mimeType } = mediaData;
    const mediaItem = { fileId, url, caption, mimeType };

    if (type === 'image') {
      plant.media.images.push(mediaItem);
    } else if (type === 'video') {
      plant.media.videos.push(mediaItem);
    } else if (type === 'audio') {
      plant.media.audio.push(mediaItem);
    }

    await plant.save();
    
    return {
      success: true,
      data: plant
    };

  } catch (error) {
    console.error('Error adding media to plant:', error);
    throw error;
  }
};

/**
 * Create or update a plant manually (not AI-generated)
 * @param {Object} plantData - Plant data
 * @returns {Promise<Object>} - Created/updated plant
 */
export const upsertPlant = async (plantData) => {
  const normalizedName = plantData.name.toLowerCase().trim();

  try {
    const plant = await Plant.findOneAndUpdate(
      { name: normalizedName },
      { 
        ...plantData, 
        name: normalizedName,
        generatedByAI: false 
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );

    return {
      success: true,
      data: plant
    };

  } catch (error) {
    console.error('Error upserting plant:', error);
    throw error;
  }
};
