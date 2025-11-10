import Bull from 'bull';
import path from 'path';
import fs from 'fs/promises';
import { Chat, Message, MediaFile } from '../models/index.js';
import { extractZip, findChatFile, findMediaFiles } from '../utils/extractor.js';
import { parseWhatsAppChat, getChatName } from '../utils/parser.js';
import { generateThumbnail, getImageDimensions } from '../utils/thumbnail.js';
import mime from 'mime-types';

const uploadQueue = new Bull('upload-processing', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

uploadQueue.process(async (job) => {
  const { chatId, userId, uploadUuid, zipPath, originalFilename } = job.data;
  
  try {
    job.progress(10);
    
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const mediaDir = process.env.MEDIA_DIR || './media';
    const extractPath = path.join(uploadDir, userId, uploadUuid, 'extracted');
    
    await fs.mkdir(extractPath, { recursive: true });
    
    job.progress(20);
    const extractedFiles = await extractZip(zipPath, extractPath);
    
    job.progress(40);
    const chatFilePath = await findChatFile(extractPath);
    const mediaFiles = await findMediaFiles(extractPath);
    
    job.progress(50);
    const messages = await parseWhatsAppChat(chatFilePath, mediaFiles);
    const chatName = getChatName(chatFilePath);
    
    await Chat.update(
      { chat_name: chatName },
      { where: { id: chatId } }
    );
    
    job.progress(60);
    
    const chatMediaDir = path.join(mediaDir, userId, chatId);
    const originalDir = path.join(chatMediaDir, 'original');
    const thumbsDir = path.join(chatMediaDir, 'thumbs');
    
    await fs.mkdir(originalDir, { recursive: true });
    await fs.mkdir(thumbsDir, { recursive: true });
    
    const mediaMap = new Map();
    for (const mediaFile of mediaFiles) {
      mediaMap.set(mediaFile.name, mediaFile);
    }
    
    let processedMessages = 0;
    const totalMessages = messages.length;
    
    for (const msg of messages) {
      const message = await Message.create({
        chat_id: chatId,
        sender_name: msg.sender_name,
        sender_is_me: msg.sender_name.toLowerCase() === 'you',
        timestamp: msg.timestamp,
        body: msg.body,
        message_type: msg.message_type,
        order_index: msg.order_index,
        metadata: msg.metadata
      });
      
      if (msg.metadata.media_file && mediaMap.has(msg.metadata.media_file)) {
        const mediaFile = mediaMap.get(msg.metadata.media_file);
        const newFileName = `${message.id}${path.extname(mediaFile.name)}`;
        const storagePath = path.join(originalDir, newFileName);
        
        await fs.copyFile(mediaFile.path, storagePath);
        
        const mimeType = mime.lookup(mediaFile.name) || 'application/octet-stream';
        let thumbPath = null;
        let width = null;
        let height = null;
        
        if (msg.message_type === 'image') {
          const dimensions = await getImageDimensions(storagePath);
          width = dimensions.width;
          height = dimensions.height;
          
          thumbPath = path.join(thumbsDir, newFileName);
          await generateThumbnail(storagePath, thumbPath);
        }
        
        await MediaFile.create({
          message_id: message.id,
          chat_id: chatId,
          user_id: userId,
          original_name: mediaFile.name,
          storage_path: storagePath,
          thumb_path: thumbPath,
          mime_type: mimeType,
          size_bytes: mediaFile.size,
          width,
          height
        });
      }
      
      processedMessages++;
      const progress = 60 + Math.floor((processedMessages / totalMessages) * 35);
      job.progress(progress);
    }
    
    const lastMessage = messages[messages.length - 1];
    await Chat.update(
      {
        message_count: messages.length,
        status: 'ready',
        last_message_at: lastMessage?.timestamp,
        last_message_preview: lastMessage?.body?.substring(0, 200)
      },
      { where: { id: chatId } }
    );
    
    job.progress(100);
    
    return { success: true, messageCount: messages.length };
  } catch (error) {
    console.error('Processing error:', error);
    
    await Chat.update(
      {
        status: 'error',
        error_message: error.message
      },
      { where: { id: chatId } }
    );
    
    throw error;
  }
});

export async function addJobToQueue(data) {
  return uploadQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000
    }
  });
}

export default uploadQueue;
```
