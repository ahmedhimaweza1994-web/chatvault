import express from 'express';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/auth.js';
import { Chat, Message, MediaFile } from '../models/index.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'chat_name',
        'original_filename',
        'message_count',
        'size_bytes',
        'status',
        'error_message',
        'last_message_at',
        'last_message_preview',
        'created_at'
      ]
    });
    
    res.json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

router.get('/:chatId', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      where: {
        id: req.params.chatId,
        user_id: req.user.id
      }
    });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json({ chat });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

router.get('/:chatId/messages', authenticate, async (req, res) => {
  try {
    const { offset = 0, limit = 50 } = req.query;
    
    const chat = await Chat.findOne({
      where: {
        id: req.params.chatId,
        user_id: req.user.id
      }
    });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const messages = await Message.findAll({
      where: { chat_id: req.params.chatId },
      include: [{
        model: MediaFile,
        as: 'media',
        required: false
      }],
      order: [['order_index', 'ASC']],
      offset: parseInt(offset),
      limit: parseInt(limit)
    });
    
    const total = await Message.count({
      where: { chat_id: req.params.chatId }
    });
    
    res.json({
      messages,
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.delete('/:chatId', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findOne({
      where: {
        id: req.params.chatId,
        user_id: req.user.id
      }
    });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const mediaDir = process.env.MEDIA_DIR || './media';
    
    const uploadPath = path.join(uploadDir, req.user.id, chat.upload_uuid);
    const mediaPath = path.join(mediaDir, req.user.id, chat.id);
    
    try {
      await fs.rm(uploadPath, { recursive: true, force: true });
      await fs.rm(mediaPath, { recursive: true, force: true });
    } catch (error) {
      console.error('Error deleting files:', error);
    }
    
    await chat.destroy();
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

router.get('/:chatId/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Search query too short' });
    }
    
    const chat = await Chat.findOne({
      where: {
        id: req.params.chatId,
        user_id: req.user.id
      }
    });
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const messages = await Message.findAll({
      where: {
        chat_id: req.params.chatId,
        body: {
          [Op.iLike]: `%${q}%`
        }
      },
      include: [{
        model: MediaFile,
        as: 'media',
        required: false
      }],
      order: [['order_index', 'ASC']],
      limit: 100
    });
    
    res.json({ messages, query: q });
  } catch (error) {
    console.error('Error searching messages:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
```
