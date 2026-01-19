import { storage, BUCKET_ID, ID, getFilePreviewUrl } from '../config/appwrite.js';
import { InputFile } from 'node-appwrite/file';

/**
 * Upload a file to Appwrite storage
 * @param {Object} file - Multer file object
 * @param {string} caption - Optional caption for the file
 * @returns {Promise<Object>} - Upload result with file ID and URL
 */
export const uploadFile = async (file, caption = '') => {
  try {
    // Verify bucket ID is configured
    if (!BUCKET_ID) {
      throw new Error('Appwrite bucket ID not configured');
    }

    // Create InputFile from the uploaded file buffer
    const inputFile = InputFile.fromBuffer(
      file.buffer,
      file.originalname
    );

    // Upload to Appwrite
    const result = await storage.createFile(
      BUCKET_ID,
      ID.unique(),
      inputFile
    );

    const fileUrl = getFilePreviewUrl(result.$id);

    return {
      success: true,
      data: {
        fileId: result.$id,
        url: fileUrl,
        caption,
        mimeType: file.mimetype,
        size: file.size,
        name: file.originalname
      }
    };

  } catch (error) {
    console.error('Appwrite upload error:', error);
    throw error;
  }
};

/**
 * Get file information from Appwrite
 * @param {string} fileId - Appwrite file ID
 * @returns {Promise<Object>} - File information
 */
export const getFileInfo = async (fileId) => {
  try {
    if (!BUCKET_ID) {
      throw new Error('Appwrite bucket ID not configured');
    }

    const file = await storage.getFile(BUCKET_ID, fileId);
    const url = getFilePreviewUrl(fileId);

    return {
      success: true,
      data: {
        fileId: file.$id,
        name: file.name,
        mimeType: file.mimeType,
        size: file.sizeOriginal,
        url,
        createdAt: file.$createdAt
      }
    };

  } catch (error) {
    console.error('Error getting file info:', error);
    throw error;
  }
};

/**
 * Delete a file from Appwrite storage
 * @param {string} fileId - Appwrite file ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFile = async (fileId) => {
  try {
    if (!BUCKET_ID) {
      throw new Error('Appwrite bucket ID not configured');
    }

    await storage.deleteFile(BUCKET_ID, fileId);

    return {
      success: true,
      message: 'File deleted successfully'
    };

  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Determine media type from mime type
 * @param {string} mimeType - MIME type of the file
 * @returns {string} - Media type (image, video, audio, or other)
 */
export const getMediaType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'other';
};
