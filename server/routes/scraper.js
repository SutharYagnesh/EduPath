const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const auth = require('../middleware/auth');
const fs = require('fs');

// Route to scrape LinkedIn jobs
router.post('/jobs', auth, async (req, res) => {
  try {
    const { query, location, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Job search query is required' });
    }
    
    // Spawn Python process to run the scraper
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../../ml/job_scraper.py'),
      query,
      location || '',
      limit?.toString() || '5'
    ]);
    
    let dataString = '';
    
    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });
    
    // Process completed
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ 
          error: 'Error running job scraper script',
          code: code
        });
      }
      
      try {
        // Parse the JSON output from the Python script
        const result = JSON.parse(dataString);
        return res.json(result);
      } catch (error) {
        console.error('Error parsing Python script output:', error);
        return res.status(500).json({ 
          error: 'Error parsing job data',
          details: error.message
        });
      }
    });
  } catch (error) {
    console.error('Server error in job scraper route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to scrape top AI tools from Google
router.post('/ai-tools', auth, async (req, res) => {
  try {
    const { query, limit } = req.body;
    
    // Default query if not provided
    const searchQuery = query || 'top AI tools';
    
    // Spawn Python process to run the scraper
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../../ml/ai_tools_scraper.py'),
      searchQuery,
      limit?.toString() || '5'
    ]);
    
    let dataString = '';
    
    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });
    
    // Process completed
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ 
          error: 'Error running AI tools scraper script',
          code: code
        });
      }
      
      try {
        // Parse the JSON output from the Python script
        const result = JSON.parse(dataString);
        return res.json(result);
      } catch (error) {
        console.error('Error parsing Python script output:', error);
        return res.status(500).json({ 
          error: 'Error parsing AI tools data',
          details: error.message
        });
      }
    });
  } catch (error) {
    console.error('Server error in AI tools scraper route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to scrape videos
router.post('/videos', auth, async (req, res) => {
  try {
    const { query, limit } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Video search query is required' });
    }
    
    // Spawn Python process to run the video scraper
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../scripts/video_scraper.py'),
      query,
      limit?.toString() || '5'
    ]);
    
    let dataString = '';
    
    // Collect data from script
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });
    
    // Process completed
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ 
          error: 'Error running video scraper script',
          code: code
        });
      }
      
      try {
        // Parse the JSON output from the Python script
        const result = JSON.parse(dataString);
        return res.json(result);
      } catch (error) {
        console.error('Error parsing Python script output:', error);
        return res.status(500).json({ 
          error: 'Error parsing video data',
          details: error.message
        });
      }
    });
  } catch (error) {
    console.error('Server error in video scraper route:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;