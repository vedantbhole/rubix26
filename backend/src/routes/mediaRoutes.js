import express from 'express';
import multer from 'multer';
import { uploadFile, getFileInfo, deleteFile, getMediaType } from '../services/mediaService.js';
import { addMediaToPlant } from '../services/plantService.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept images, videos, and audio files
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
  }
});

/**
 * POST /api/media/upload
 * Upload a media file to Appwrite
 * Optional: plantName query param to associate with a plant
 */
router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const { caption = '', plantName = '' } = req.body;
    
    // Upload to Appwrite
    const result = await uploadFile(req.file, caption);

    // If plantName provided, associate media with plant
    if (plantName) {
      const mediaType = getMediaType(req.file.mimetype);
      await addMediaToPlant(plantName, {
        type: mediaType,
        fileId: result.data.fileId,
        url: result.data.url,
        caption,
        mimeType: req.file.mimetype
      });
    }

    res.status(201).json(result);

  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/media/:fileId
 * Get file information by ID
 */
router.get('/:fileId', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const result = await getFileInfo(fileId);
    res.json(result);
  } catch (error) {
    if (error.code === 404 || error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'File not found'
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/media/:fileId
 * Delete a file from Appwrite
 */
router.delete('/:fileId', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const result = await deleteFile(fileId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
