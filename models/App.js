const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['web', 'mobile', 'website', 'other'], required: true },
  status: { type: String, enum: ['draft', 'generated', 'published', 'archived'], default: 'draft' },
  aiProvider: { type: String, enum: ['chatgpt', 'claude', 'gemini', 'other'], required: true },
  prompt: String,
  code: {
    html: String,
    css: String,
    javascript: String,
    json: String
  },
  preview: String,
  storePublished: { type: Boolean, default: false },
  customDomain: String,
  theme: String,
  publicUrl: String,
  settings: {
    privacy: String,
    notifications: Boolean
  },
  generationProgress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('App', appSchema);