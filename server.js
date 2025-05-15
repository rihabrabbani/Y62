const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Setup ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Basic in-memory storage for users and download counts
const users = {};
const sessions = {};

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir);
}


// Fix: Use the array directly instead of trying to parse it as JSON
const agent = ytdl.createAgent(JSON.parse(fs.readFileSync("cookies.json")));


// Authentication middleware
const authenticate = (req, res, next) => {
  const sessionId = req.headers.authorization;
  
  if (sessionId && sessions[sessionId]) {
    req.user = sessions[sessionId];
    return next();
  }
  
  return res.status(401).json({ error: 'Unauthorized' });
};

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

// Video info endpoint
app.post('/api/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    console.log('Received URL:', url);
    
    if (!url || !(url.includes('youtube.com') || url.includes('youtu.be'))) {
      return res.status(400).json({ error: 'Invalid YouTube URL format' });
    }
    
    // Get video info using the improved library with cookies
    const info = await ytdl.getInfo(url, {agent: agent});
    
    res.json({
      url: url,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      duration: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name,
      formats: info.formats.filter(format => format.hasVideo || format.hasAudio).map(format => ({
        itag: format.itag,
        quality: format.qualityLabel || format.audioBitrate,
        mimeType: format.mimeType,
        contentLength: format.contentLength,
        hasVideo: format.hasVideo,
        hasAudio: format.hasAudio,
        container: format.container
      }))
    });
  } catch (error) {
    console.error('Error fetching video info:', error.message);
    
    // Provide detailed error messages for debugging
    if (error.message.includes('Video unavailable')) {
      return res.status(400).json({ error: 'This video is unavailable or restricted' });
    } else if (error.message.includes('not a YouTube domain')) {
      return res.status(400).json({ error: 'Not a valid YouTube URL' });
    } else if (error.message.includes('No video id found')) {
      return res.status(400).json({ error: 'Could not extract video ID from URL' });
    }
    
    res.status(400).json({ error: `Could not fetch video info: ${error.message}` });
  }
});

// Download endpoint
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
    const isAudioOnly = format === 'mp3';
    
    // Create proper YouTube options with cookies and agent
    const options = {
      playerClients: ["WEB_EMBEDDED", "IOS", "ANDROID", "TV"],
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        client: agent
      }
    };
    
    const info = await ytdl.getInfo(url, {agent: agent});
    const sanitizedTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    
    // For audio-only downloads (MP3)
    if (isAudioOnly) {
      console.log('Processing audio-only download (MP3)...');
      
      // We need to download a video format that includes audio
      // Get a format with both video and audio for simplicity
      const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
      
      if (!format) {
        return res.status(400).json({ error: 'Could not find suitable format for audio extraction' });
      }
      
      console.log(`Selected format for audio extraction: ${format.qualityLabel || format.quality}`);
      
      // Create temporary and final filenames
      const tempVideoPath = path.join(downloadsDir, `temp-video-${Date.now()}.mp4`);
      const fileName = `${sanitizedTitle}-${Date.now()}.mp3`;
      const outputPath = path.join(downloadsDir, fileName);
      
      // Download the video first
      console.log('Downloading video source for audio extraction...');
      const videoStream = ytdl.downloadFromInfo(info, { format: format })
        .pipe(fs.createWriteStream(tempVideoPath));
        
      await new Promise((resolve, reject) => {
        videoStream.on('finish', resolve);
        videoStream.on('error', reject);
      });
      
      console.log('Video download complete, extracting audio to MP3...');
      
      // Now extract audio using ffmpeg
      ffmpeg()
        .input(tempVideoPath)
        .noVideo() // Discard video
        .format('mp3')
        .audioCodec('libmp3lame')
        .audioBitrate(192) // Good quality MP3
        .on('progress', (progressData) => {
          const progress = Math.floor(progressData.percent);
          console.log(`MP3 extraction progress: ${progress}%`);
        })
        .on('end', () => {
          console.log('Audio extraction completed!');
          
          // Clean up temp video file - we don't need it anymore
          try {
            fs.unlinkSync(tempVideoPath);
          } catch (cleanupErr) {
            console.error('Error cleaning up temp video file:', cleanupErr);
          }
          
          // Increment download count for free users
          if (!users[email].isPremium) {
            users[email].downloadCount++;
          }
          
          res.json({ 
            downloadUrl: `/api/download-file/${fileName}`,
            downloadCount: users[email].downloadCount
          });
        })
        .on('error', (err) => {
          console.error('Error during audio extraction:', err.message);
          
          // Clean up on error
          try {
            if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
          } catch (cleanupErr) {
            console.error('Error cleaning up temp file:', cleanupErr);
          }
          
          res.status(500).json({ error: 'Audio extraction failed: ' + err.message });
        })
        .save(outputPath);
    } 
    // For video downloads (MP4)
    else {
      // Select appropriate formats based on requested quality
      let videoFormat, audioFormat;

      // Get audio format - we always need audio
      audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
      
      // For video, select based on resolution
      // Find video format that matches the requested resolution (or closest to it)
      const availableFormats = info.formats.filter(format => format.hasVideo && !format.hasAudio);
      
      // Map common resolution names to actual pixel heights
      const resolutionMap = {
        '360p': 360,
        '480p': 480,
        '720p': 720,
        '1080p': 1080,
        '1440p': 1440,
        '2160p': 2160,
      };
      
      const targetHeight = resolutionMap[resolution] || 720; // Default to 720p if not found
      
      // Find closest matching resolution
      videoFormat = availableFormats.reduce((prev, curr) => {
        if (!curr.height) return prev;
        
        const prevDiff = prev ? Math.abs(prev.height - targetHeight) : Infinity;
        const currDiff = Math.abs(curr.height - targetHeight);
        
        return currDiff < prevDiff ? curr : prev;
      }, null);
      
      // If no format found, use highest video
      if (!videoFormat) {
        console.log('No matching video format found, using highest available');
        videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
      } else {
        console.log(`Selected video format with resolution: ${videoFormat.height}p`);
      }
      
      if (!videoFormat || !audioFormat) {
        return res.status(400).json({ error: 'Could not find suitable formats' });
      }
      
      const fileName = `${sanitizedTitle}-${Date.now()}.mp4`;
      const outputPath = path.join(downloadsDir, fileName);
      
      // Create temporary files for video and audio
      const tempVideoPath = path.join(downloadsDir, `temp-video-${Date.now()}.mp4`);
      const tempAudioPath = path.join(downloadsDir, `temp-audio-${Date.now()}.mp4`);
      
      // Download video and audio to temporary files first
      console.log('Downloading video...');
      const videoStream = ytdl.downloadFromInfo(info, { format: videoFormat })
        .pipe(fs.createWriteStream(tempVideoPath));
        
      await new Promise((resolve, reject) => {
        videoStream.on('finish', resolve);
        videoStream.on('error', reject);
      });
      
      console.log('Downloading audio...');
      const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat })
        .pipe(fs.createWriteStream(tempAudioPath));
        
      await new Promise((resolve, reject) => {
        audioStream.on('finish', resolve);
        audioStream.on('error', reject);
      });
      
      console.log('Merging video and audio...');
      
      // Now merge the files using ffmpeg
      ffmpeg()
        .input(tempVideoPath)
        .input(tempAudioPath)
        .outputOptions('-c:v copy')
        .outputOptions('-c:a aac')
        .outputOptions('-b:a 192k')
        .on('progress', (progressData) => {
          const progress = Math.floor(progressData.percent);
          console.log(`Merge progress: ${progress}%`);
        })
        .on('end', () => {
          console.log('Merge completed');
          
          // Clean up temp files
          try {
            fs.unlinkSync(tempVideoPath);
            fs.unlinkSync(tempAudioPath);
          } catch (cleanupErr) {
            console.error('Error cleaning up temp files:', cleanupErr);
          }
          
          // Increment download count for free users
          if (!users[email].isPremium) {
            users[email].downloadCount++;
          }
          
          res.json({ 
            downloadUrl: `/api/download-file/${fileName}`,
            downloadCount: users[email].downloadCount
          });
        })
        .on('error', (err) => {
          console.error('Error:', err.message);
          
          // Clean up temp files on error too
          try {
            if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
            if (fs.existsSync(tempAudioPath)) fs.unlinkSync(tempAudioPath);
          } catch (cleanupErr) {
            console.error('Error cleaning up temp files:', cleanupErr);
          }
          
          res.status(500).json({ error: 'Download failed: ' + err.message });
        })
        .save(outputPath);
    }
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Get download file
app.get('/api/download-file/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(downloadsDir, fileName);
  
  if (fs.existsSync(filePath)) {
    // Set up to track completion of download
    res.on('finish', () => {
      // Delete the file after it has been successfully sent to the client
      console.log(`Download complete, removing file: ${fileName}`);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Error removing file ${fileName}:`, err);
        } else {
          console.log(`Successfully removed file: ${fileName}`);
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
  
  fs.readdir(downloadsDir, (err, files) => {
    if (err) {
      return console.error('Could not read downloads directory:', err);
    }
    
    const now = Date.now();
    
    files.forEach(file => {
      // Skip temp files that are currently being processed
      if (file.startsWith('temp-')) {
        return;
      }
      
      const filePath = path.join(downloadsDir, file);
      
      fs.stat(filePath, (statErr, stats) => {
        if (statErr) {
          return console.error(`Could not get stats for file ${file}:`, statErr);
        }
        
        // Remove files older than 2 hours (files that were likely abandoned)
        const fileAge = now - stats.mtimeMs;
        if (fileAge > 2 * 60 * 60 * 1000) { // 2 hours in milliseconds
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(`Error removing old file ${file}:`, unlinkErr);
            } else {
              console.log(`Removed old file: ${file}`);
            }
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
