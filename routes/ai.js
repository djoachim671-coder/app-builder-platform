const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');
const App = require('../models/App');

const router = express.Router();

// Generate with AI
router.post('/generate', auth, async (req, res) => {
  try {
    const { appId, prompt, aiProvider } = req.body;
    const user = await User.findById(req.userId);
    
    // Check credits
    if (user.credits < 1) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }
    
    const app = await App.findById(appId);
    if (!app) return res.status(404).json({ message: 'App not found' });
    
    let generatedCode;
    
    // Call AI API based on provider
    if (aiProvider === 'chatgpt') {
      generatedCode = await generateWithChatGPT(prompt);
    } else if (aiProvider === 'claude') {
      generatedCode = await generateWithClaude(prompt);
    } else if (aiProvider === 'gemini') {
      generatedCode = await generateWithGemini(prompt);
    }
    
    // Deduct credit
    user.credits -= 1;
    await user.save();
    
    // Save generated code
    app.code = generatedCode;
    app.status = 'generated';
    await app.save();
    
    res.json({ message: 'App generated successfully', code: generatedCode });
  } catch (error) {
    res.status(500).json({ message: 'Error generating with AI', error });
  }
});

async function generateWithChatGPT(prompt) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [{ role: 'user', content: `Generate HTML/CSS/JS for: ${prompt}` }],
      max_tokens: 2000
    }, {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('ChatGPT error:', error);
    throw error;
  }
}

async function generateWithClaude(prompt) {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: `Generate HTML/CSS/JS for: ${prompt}` }]
    }, {
      headers: { 'x-api-key': process.env.CLAUDE_API_KEY }
    });
    
    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude error:', error);
    throw error;
  }
}

async function generateWithGemini(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: `Generate HTML/CSS/JS for: ${prompt}` }]
        }]
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini error:', error);
    throw error;
  }
}

module.exports = router;