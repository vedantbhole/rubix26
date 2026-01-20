import express from 'express';
import multer from 'multer';
import { identifyPlant } from '../services/plantNetService.js';
import { getChatResponse } from '../services/chatService.js';
import path from 'path';

const router = express.Router();

// Configure multer for temporary file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

/**
 * POST /api/chat/identify
 * Upload an image to identify plant
 */
router.post('/identify', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image file provided' });
        }

        const result = await identifyPlant(req.file.path);

        if (result.success) {
            res.json({
                success: true,
                data: result
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }

    } catch (error) {
        console.error('Identify Route Error:', error);
        res.status(500).json({ success: false, error: 'Server error during identification' });
    }
});

/**
 * POST /api/chat/message
 * Send a message to the chatbot
 */
router.post('/message', async (req, res) => {
    try {
        const { message, context, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, error: 'Message is required' });
        }

        // Pass detailed plant context if available, otherwise just use provided context object
        const plantContext = context || {};

        const response = await getChatResponse(message, plantContext, history || []);

        res.json({
            success: true,
            data: {
                response,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Chat Message Error:', error);
        res.status(500).json({ success: false, error: 'Server error processing message' });
    }
});

export default router;
