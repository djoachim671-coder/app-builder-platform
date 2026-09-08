const express = require('express');
const App = require('../models/App');
const auth = require('../middleware/auth');
const { io } = require('../server');

const router = express.Router();

// Create App
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, description, aiProvider, prompt } = req.body;
    
    const app = new App({
      userId: req.userId,
      name,
      type,
      description,
      aiProvider,
      prompt,
      status: 'draft'
    });
    
    await app.save();
    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: 'Error creating app', error });
  }
});

// Get User Apps
router.get('/', auth, async (req, res) => {
  try {
    const apps = await App.find({ userId: req.userId });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching apps', error });
  }
});

// Generate App (with real-time progress)
router.post('/:id/generate', auth, async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app || app.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'App not found' });
    }
    
    app.status = 'generated';
    app.generationProgress = 0;
    await app.save();
    
    // Emit progress updates via Socket.io
    io.emit('generation-progress', { appId: app._id, progress: 0 });
    
    res.json({ message: 'Generation started', appId: app._id });
  } catch (error) {
    res.status(500).json({ message: 'Error generating app', error });
  }
});

// Publish to Store
router.post('/:id/publish', auth, async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'App not found' });
    
    app.storePublished = true;
    app.publicUrl = `https://app-builder-platform.com/apps/${app._id}`;
    await app.save();
    
    res.json({ message: 'App published to store', publicUrl: app.publicUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing app', error });
  }
});

module.exports = router;