import mongoose from 'mongoose';

const { Schema } = mongoose;

// Sub-schema for media items
const mediaItemSchema = new Schema({
  fileId: { type: String, required: true },
  url: { type: String },
  caption: { type: String },
  mimeType: { type: String },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

// Sub-schema for medicinal uses
const medicinalUseSchema = new Schema({
  use: { type: String, required: true },
  traditionalEvidence: { type: Boolean, default: false },
  scientificEvidence: { 
    type: String, 
    enum: ['none', 'preliminary', 'moderate', 'strong'],
    default: 'none'
  }
}, { _id: false });

// Sub-schema for cultivation info
const cultivationInfoSchema = new Schema({
  soil: String,
  water: String,
  sunlight: String,
  propagation: String,
  tips: [String]
}, { _id: false });

// Sub-schema for explanations
const explanationsSchema = new Schema({
  brief: String,
  detailed: String,
  audioTranscript: String
}, { _id: false });

// Main Plant schema
const plantSchema = new Schema({
  // Identification
  name: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true,
    lowercase: true,
    trim: true
  },
  scientificName: { type: String, trim: true },
  commonNames: [{ type: String }],
  family: { type: String },

  // Description
  description: { type: String },
  habitat: { type: String },
  partsUsed: [{ type: String }],

  // Medicinal information
  medicinalUses: [medicinalUseSchema],
  safetyWarnings: [{ type: String }],

  // Cultivation
  cultivationInfo: cultivationInfoSchema,

  // Explanations (for audio/text)
  explanations: explanationsSchema,

  // Media (stored in Appwrite)
  media: {
    images: [mediaItemSchema],
    videos: [mediaItemSchema],
    audio: [mediaItemSchema]
  },

  // Interesting facts
  interestingFacts: [{ type: String }],

  // Metadata
  generatedByAI: { type: Boolean, default: false },
  aiModel: { type: String },
  viewCount: { type: Number, default: 0 },
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for text search
plantSchema.index({ 
  name: 'text', 
  scientificName: 'text', 
  commonNames: 'text',
  description: 'text' 
});

// Virtual for checking if plant has media
plantSchema.virtual('hasMedia').get(function() {
  return (
    (this.media?.images?.length > 0) ||
    (this.media?.videos?.length > 0) ||
    (this.media?.audio?.length > 0)
  );
});

// Static method to find by name (case-insensitive)
plantSchema.statics.findByName = function(name) {
  return this.findOne({ name: name.toLowerCase().trim() });
};

// Instance method to increment view count
plantSchema.methods.incrementViews = async function() {
  this.viewCount += 1;
  return this.save();
};

const Plant = mongoose.model('Plant', plantSchema);

export default Plant;
