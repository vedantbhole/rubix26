import express from 'express';
import Plant from '../models/Plant.js';

const router = express.Router();

// GET all plants
// Supports query params: search, ayush_system, disease_category, etc.
router.get('/', async (req, res) => {
  try {
    const { search, ayush_system, disease_category, region, sort } = req.query;
    let query = {};

    // Search logic
    if (search) {
      query.$text = { $search: search };
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

    let plantQuery = Plant.find(query);

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
