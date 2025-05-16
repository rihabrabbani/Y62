const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic in-memory storage for users and download counts
const users = {};
const sessions = {};

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}

// Authentication middleware
const authenticate = (req, res, next) => {
  const sessionId = req.headers.authorization;
  
  if (sessionId && sessions[sessionId]) {
    req.user = sessions[sessionId];
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthorized' });
};

// Function to execute Python script
function executePythonScript(args) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['download_video.py', ...args]);
    
    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      // Just log the error/progress data but don't treat as error
      console.log(`Python progress: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          // Trim the output to remove any whitespace or newlines
          const cleanOutput = outputData.trim();
          if (!cleanOutput) {
            reject(new Error('No output from Python script'));
            return;
          }
          
          const result = JSON.parse(cleanOutput);
          resolve(result);
        } catch (e) {
          console.error('Failed to parse Python output:', e);
          console.error('Raw output:', outputData);
          reject(new Error(`Failed to parse Python output: ${e.message}`));
        }
      }
    });
    
    pythonProcess.on('error', (error) => {
      reject(new Error(`Failed to start Python process: ${error.message}`));
    });
  });
}

// Register endpoint
app.post('/api/register', (req, res) => {
  const { email, password } = req.body;
  
  if (users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  users[email] = {
    email,
    password, // In a real app, you would hash the password
    isPremium: false,
    downloadCount: 0
  };
  
  const sessionId = crypto.randomUUID();
  sessions[sessionId] = { email };
  
  res.json({ 
    success: true, 
    user: { email, isPremium: false, downloadCount: 0 },
    token: sessionId
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const sessionId = crypto.randomUUID();
  sessions[sessionId] = { email };
  
  res.json({ 
    success: true, 
    user: { 
      email, 
      isPremium: users[email].isPremium, 
      downloadCount: users[email].downloadCount 
    },
    token: sessionId
  });
});

// Get user info endpoint
app.get('/api/user', authenticate, (req, res) => {
  const { email } = req.user;
  const user = users[email];
  
  res.json({
    email: user.email,
    isPremium: user.isPremium,
    downloadCount: user.downloadCount
  });
});

// Upgrade to premium
app.post('/api/upgrade', authenticate, (req, res) => {
  const { email } = req.user;
  
  if (!users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[email].isPremium = true;
  
  res.json({ 
    success: true, 
    user: { 
      email, 
      isPremium: true, 
      downloadCount: users[email].downloadCount 
    } 
  });
});

// Video info endpoint - updated to use Python script
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Received URL:', url);
    
    if (!url || !(url.includes('youtube.com') || url.includes('youtu.be'))) {
      return res.status(400).json({ error: 'Invalid YouTube URL format' });
    }

    // Execute Python script to get video info
    const videoInfo = await executePythonScript(['info', url]);
    
    if (videoInfo.error) {
      return res.status(400).json({ error: videoInfo.error });
    }
    
    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error.message);
    res.status(400).json({ error: `Could not fetch video info: ${error.message}` });
  }
});

// Download endpoint - updated to use Python script
app.post('/api/download', authenticate, async (req, res) => {
  try {
    const { email } = req.user;
    const { url, quality } = req.body;
    
    // Check if user can download
    if (!users[email].isPremium && users[email].downloadCount >= 10) {
      return res.status(403).json({ error: 'Free download limit reached' });
    }

    console.log('Download requested:', url, quality);
    
    // Parse quality parameter - format is like "720p-mp4" or "1080p-mp3"
    const [resolution, format] = quality.split('-');
    const resolutionNumber = resolution.replace('p', '');
    
    // Create a unique download folder for this request
    const downloadId = Date.now().toString();
    const downloadFolder = path.join(downloadsDir, downloadId);
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder);
    }
    
    // Execute Python script for download
    console.log(`Starting download with resolution ${resolutionNumber} and format ${format}...`);
    const downloadResult = await executePythonScript(['download', url, downloadFolder, resolutionNumber, format]);
    
    if (downloadResult.error) {
      console.error('Download error:', downloadResult.error);
      return res.status(500).json({ error: downloadResult.error });
    }
    
    console.log('Download completed successfully:', downloadResult);
    
    // Verify the file exists
    const filePath = path.join(downloadFolder, downloadResult.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Downloaded file not found on server' });
    }
    
    // Increment download count for free users
    if (!users[email].isPremium) {
      users[email].downloadCount++;
    }
    
    const fileName = downloadResult.file;
    
    res.json({ 
      downloadUrl: `/api/download-file/${downloadId}/${fileName}`,
      downloadCount: users[email].downloadCount
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get download file - updated to support the new folder structure
app.get('/api/download-file/:folderId/:fileName', (req, res) => {
  const folderId = req.params.folderId;
  const fileName = req.params.fileName;
  const folderPath = path.join(downloadsDir, folderId);
  const filePath = path.join(folderPath, fileName);
  
  if (fs.existsSync(filePath)) {
    // Set up to track completion of download
    res.on('finish', () => {
      // Delete the file and folder after it has been successfully sent to the client
      console.log(`Download complete, removing file: ${fileName}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error removing file ${fileName}:`, err);
        } else {
          console.log(`Successfully removed file: ${fileName}`);
          // Try to remove the folder too
          fs.rmdir(folderPath, (rmErr) => {
            if (rmErr) {
              console.error(`Error removing folder ${folderId}:`, rmErr);
            } else {
              console.log(`Successfully removed folder: ${folderId}`);
            }
          });
        }
      });
    });
    
    res.download(filePath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

// Add a cleanup routine to remove any stale files (files that might have been downloaded partially)
// This runs every hour
setInterval(() => {
  console.log('Running cleanup of download directory');
  
  fs.readdir(downloadsDir, (err, folders) => {
    if (err) {
      return console.error('Could not read downloads directory:', err);
    }
    
    const now = Date.now();
    
    folders.forEach(folder => {
      const folderPath = path.join(downloadsDir, folder);
      
      // Check if it's a directory
      fs.stat(folderPath, (statErr, stats) => {
        if (statErr) {
          return console.error(`Could not get stats for ${folder}:`, statErr);
        }
        
        if (!stats.isDirectory()) return;
        
        // Remove folders older than 2 hours
        const folderAge = now - stats.mtimeMs;
        if (folderAge > 2 * 60 * 60 * 1000) { // 2 hours in milliseconds
          fs.readdir(folderPath, (dirErr, files) => {
            if (dirErr) {
              return console.error(`Could not read folder ${folder}:`, dirErr);
            }
            
            // Delete all files in the folder
            const deletePromises = files.map(file => {
              return new Promise((resolve) => {
                fs.unlink(path.join(folderPath, file), (err) => {
                  if (err) console.error(`Error removing file ${file}:`, err);
                  resolve();
                });
              });
            });
            
            Promise.all(deletePromises).then(() => {
              // Then delete the folder itself
              fs.rmdir(folderPath, (rmErr) => {
                if (rmErr) {
                  console.error(`Error removing folder ${folder}:`, rmErr);
                } else {
                  console.log(`Removed old folder: ${folder}`);
                }
              });
            });
          });
        }
      });
    });
  });
}, 60 * 60 * 1000); // Run every hour

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
