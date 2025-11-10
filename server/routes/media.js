import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { authenticate } from '../middleware/auth.js';
import { MediaFile } from '../models/index.js';

const router = express.Router();

router.get('/:userId/:chatId/:filename', authenticate, async (req, res) => {
  try {
    const { userId, chatId, filename } = req.params;
    
    if (userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const mediaFile = await MediaFile.findOne({
      where: {
        user_id: userId,
        chat_id: chatId,
        original_name: filename
      }
    });
    
    if (!mediaFile) {
      return res.status(404).json({ error: 'Media file not found' });
    }
    
    const filePath = req.query.thumb && mediaFile.thumb_path ? 
      mediaFile.thumb_path : 
      mediaFile.storage_path;
    
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found on disk' });
    }
    
    res.setHeader('Content-Type', mediaFile.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${mediaFile.original_name}"`);
    
    const fileStream = (await import('fs')).createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error serving media:', error);
    res.status(500).json({ error: 'Failed to serve media' });
  }
});

export default router;
```
