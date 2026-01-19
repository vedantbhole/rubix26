import { Client, Storage, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Appwrite client
const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

// Storage service for media files
export const storage = new Storage(client);

// Default bucket ID for plant media
export const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || '';

// Helper function to get file preview URL
export const getFilePreviewUrl = (fileId) => {
  const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = process.env.APPWRITE_PROJECT_ID || '';
  return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
};

// Helper function to get file download URL
export const getFileDownloadUrl = (fileId) => {
  const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
  const projectId = process.env.APPWRITE_PROJECT_ID || '';
  return `${endpoint}/storage/buckets/${BUCKET_ID}/files/${fileId}/download?project=${projectId}`;
};

export { ID };
export default client;
