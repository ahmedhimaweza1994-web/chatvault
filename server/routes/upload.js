import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { authenticate } from '../middleware/auth.js';
import { Chat } from '../models/index.js';
import { addJobToQueue } from '../queue/processor.js';

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || './uploads';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const userDir = path.join(uploadDir, req.user.id);
    await fs.mkdir(userDir, { recursive: true });
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uploadUuid = uuidv4();
    req.uploadUuid = uploadUuid;
    cb(null, `${uploadUuid}.zip`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_UPLOAD_SIZE) || 500 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Only ZIP files are allowed'));
    }
  }
});

router.post('/', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const chat = await Chat.create({
      user_id: req.user.id,
      chat_name: 'Processing...',
      original_filename: req.file.originalname,
      upload_uuid: req.uploadUuid,
      size_bytes: req.file.size,
      status: 'processing'
    });
    
    await addJobToQueue({
      chatId: chat.id,
      userId: req.user.id,
      uploadUuid: req.uploadUuid,
      zipPath: req.file.path,
      originalFilename: req.file.originalname
    });
    
    res.status(202).json({
      chatId: chat.id,
      status: 'processing',
      message: 'Upload successful. Processing chat...'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

export default router;
```
