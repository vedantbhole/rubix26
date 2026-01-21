import express from 'express';
import Plant from '../models/Plant.js';

const router = express.Router();

// GET all plants with pagination
// Supports query params: search, ayush_system, disease_category, page, limit, etc.
router.get('/', async (req, res) => {
  try {
    const { search, ayush_system, disease_category, region, sort, page = 1, limit = 12 } = req.query;
    let query = {};

    // Search logic
    if (search) {
      query.$or = [
        { common_name: { $regex: search, $options: 'i' } },
        { botanical_name: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { medicinal_properties: { $regex: search, $options: 'i' } },
        { therapeutic_uses: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (ayush_system && ayush_system !== 'all') {
      query.ayush_system = ayush_system;
    }
    if (disease_category) {
      query.disease_category = disease_category;
    }
    if (region) {
      query.region = { $regex: region, $options: 'i' };
    }

    // Get total count for pagination
    const total = await Plant.countDocuments(query);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let plantQuery = Plant.find(query).skip(skip).limit(limitNum);

    // Sort logic
    if (sort) {
      const [field, order] = sort.split(':');
      plantQuery = plantQuery.sort({ [field]: order === 'desc' ? -1 : 1 });
    } else {
      plantQuery = plantQuery.sort({ common_name: 1 });
    }

    const plants = await plantQuery;

    res.status(200).json({
      success: true,
      count: plants.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      data: plants
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET single plant by ID (Mongoose ID or jsonId)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let plant;

    // Check if valid ObjectID
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      plant = await Plant.findById(id);
    } else {
      // Try searching by jsonId
      plant = await Plant.findOne({ jsonId: parseInt(id) });
    }

    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    res.status(200).json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
