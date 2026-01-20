import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Cookie options
const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name, email, and password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters'
            });
        }

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'An account with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token and set cookie
        const token = generateToken(user._id);
        res.cookie('token', token, getCookieOptions());

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                bookmarkedPlants: user.bookmarkedPlants,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Signup error:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }

        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'An account with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error during signup'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated'
            });
        }

        // Generate token and set cookie
        const token = generateToken(user._id);
        res.cookie('token', token, getCookieOptions());

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                bookmarkedPlants: user.bookmarkedPlants,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error during login'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user (clear cookie)
// @access  Public
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bookmarkedPlants: user.bookmarkedPlants,
                bookmarkCount: user.bookmarkCount,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error getting profile'
        });
    }
});

// @route   PATCH /api/auth/profile
// @desc    Update user profile
// @access  Private
router.patch('/profile', protect, async (req, res) => {
    try {
        const { name, email } = req.body;
        const updates = {};

        if (name) {
            if (name.length < 2 || name.length > 50) {
                return res.status(400).json({
                    success: false,
                    error: 'Name must be between 2 and 50 characters'
                });
            }
            updates.name = name.trim();
        }

        if (email) {
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    error: 'Please enter a valid email address'
                });
            }

            // Check if email is already taken by another user
            const existingUser = await User.findOne({
                email: email.toLowerCase(),
                _id: { $ne: req.user._id }
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'This email is already in use'
                });
            }
            updates.email = email.toLowerCase().trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bookmarkedPlants: user.bookmarkedPlants,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            error: 'Server error updating profile'
        });
    }
});

// Helper to resolve plant ID
const resolvePlantId = async (id) => {
    // If it's a valid ObjectId, return it
    if (mongoose.Types.ObjectId.isValid(id)) {
        return id;
    }
    // If it's a number (or string number), try to find by jsonId
    const numId = parseInt(id);
    if (!isNaN(numId)) {
        const Plant = mongoose.model('Plant');
        const plant = await Plant.findOne({ jsonId: numId });
        return plant ? plant._id : null;
    }
    return null;
};

// @route   PUT /api/auth/bookmarks
// @desc    Update user's bookmarked plants
// @access  Private
router.put('/bookmarks', protect, async (req, res) => {
    try {
        const { plantId, action } = req.body;

        if (!plantId) {
            return res.status(400).json({
                success: false,
                error: 'Plant ID is required'
            });
        }

        const resolvedId = await resolvePlantId(plantId);
        if (!resolvedId) {
            return res.status(404).json({
                success: false,
                error: 'Plant not found'
            });
        }

        const user = await User.findById(req.user._id);

        if (action === 'add') {
            // Add plant if not already bookmarked
            if (!user.bookmarkedPlants.some(id => id.toString() === resolvedId.toString())) {
                user.bookmarkedPlants.push(resolvedId);
            }
        } else if (action === 'remove') {
            // Remove plant from bookmarks
            user.bookmarkedPlants = user.bookmarkedPlants.filter(
                id => id.toString() !== resolvedId.toString()
            );
        } else {
            return res.status(400).json({
                success: false,
                error: 'Action must be "add" or "remove"'
            });
        }

        await user.save();

        res.json({
            success: true,
            data: {
                bookmarkedPlants: user.bookmarkedPlants,
                bookmarkCount: user.bookmarkedPlants.length
            }
        });
    } catch (error) {
        console.error('Update bookmarks error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error updating bookmarks'
        });
    }
});

// @route   PUT /api/auth/bookmarks/sync
// @desc    Sync bookmarks from frontend (replace all)
// @access  Private
router.put('/bookmarks/sync', protect, async (req, res) => {
    try {
        const { plantIds } = req.body;

        if (!Array.isArray(plantIds)) {
            return res.status(400).json({
                success: false,
                error: 'plantIds must be an array'
            });
        }

        // Resolve all IDs
        const resolvedIds = [];
        for (const id of plantIds) {
            const resolved = await resolvePlantId(id);
            if (resolved) {
                resolvedIds.push(resolved);
            }
        }

        // Deduplicate
        const uniqueIds = [...new Set(resolvedIds.map(id => id.toString()))];

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { bookmarkedPlants: uniqueIds },
            { new: true }
        );

        res.json({
            success: true,
            data: {
                bookmarkedPlants: user.bookmarkedPlants,
                bookmarkCount: user.bookmarkedPlants.length
            }
        });
    } catch (error) {
        console.error('Sync bookmarks error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error syncing bookmarks'
        });
    }
});

export default router;
