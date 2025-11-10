import fs from 'fs/promises';
import path from 'path';
import { parse, format } from 'date-fns';

const TIMESTAMP_PATTERNS = [
  /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)\]?\s*-?\s*([^:]+?):\s*(.*)$/i,
  /^\[?(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)\]?\s*-?\s*([^:]+?):\s*(.*)$/i,
  /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)\s*-\s*([^:]+?):\s*(.*)$/i
];

const DATE_FORMATS = [
  'M/d/yy, h:mm a',
  'M/d/yy, h:mm:ss a',
  'M/d/yyyy, h:mm a',
  'M/d/yyyy, h:mm:ss a',
  'M/d/yy, HH:mm',
  'M/d/yy, HH:mm:ss',
  'M/d/yyyy, HH:mm',
  'M/d/yyyy, HH:mm:ss',
  'd/M/yy, h:mm a',
  'd/M/yy, h:mm:ss a',
  'd/M/yyyy, h:mm a',
  'd/M/yyyy, h:mm:ss a',
  'd/M/yy, HH:mm',
  'd/M/yy, HH:mm:ss',
  'd/M/yyyy, HH:mm',
  'd/M/yyyy, HH:mm:ss'
];

const MEDIA_PATTERNS = {
  image: /\.(jpg|jpeg|png|gif|webp)$/i,
  video: /\.(mp4|mov|avi|mkv|webm)$/i,
  audio: /\.(opus|ogg|mp3|m4a|aac|wav)$/i,
  document: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|zip|rar)$/i
};

function parseTimestamp(dateStr) {
  for (const format of DATE_FORMATS) {
    try {
      const date = parse(dateStr, format, new Date());
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (e) {
      continue;
    }
  }
  return new Date();
}

function detectMessageType(body, mediaFiles) {
  if (!body) return 'text';
  
  const lowerBody = body.toLowerCase();
  
  if (lowerBody.includes('<media omitted>') || 
      lowerBody.includes('image omitted') ||
      lowerBody.includes('video omitted') ||
      lowerBody.includes('audio omitted')) {
    return 'text';
  }
  
  for (const [type, pattern] of Object.entries(MEDIA_PATTERNS)) {
    if (pattern.test(body)) {
      return type;
    }
  }
  
  if (body.match(/https?:\/\//)) {
    return 'link';
  }
  
  return 'text';
}

function findMediaFile(messageBody, mediaFiles) {
  if (!messageBody || !mediaFiles || mediaFiles.length === 0) {
    return null;
  }
  
  const fileNameMatch = messageBody.match(/([A-Z]{3}-\d{8}-[A-Z]{2}\d{4}\.\w+)/i);
  if (fileNameMatch) {
    const fileName = fileNameMatch[1];
    return mediaFiles.find(f => f.name === fileName);
  }
  
  for (const mediaFile of mediaFiles) {
    if (messageBody.includes(mediaFile.name)) {
      return mediaFile;
    }
  }
  
  return null;
}

export async function parseWhatsAppChat(txtFilePath, mediaFiles = []) {
  const content = await fs.readFile(txtFilePath, 'utf-8');
  const lines = content.split('\n');
  
  const messages = [];
  let currentMessage = null;
  let orderIndex = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    let matched = false;
    
    for (const pattern of TIMESTAMP_PATTERNS) {
      const match = line.match(pattern);
      
      if (match) {
        if (currentMessage) {
          messages.push(currentMessage);
        }
        
        let timestamp, sender, body;
        
        if (match.length === 4) {
          timestamp = parseTimestamp(match[1]);
          sender = match[2].trim();
          body = match[3].trim();
        } else if (match.length === 5) {
          timestamp = parseTimestamp(`${match[1]}, ${match[2]}`);
          sender = match[3].trim();
          body = match[4].trim();
        }
        
        const mediaFile = findMediaFile(body, mediaFiles);
        const messageType = mediaFile ? 
          (MEDIA_PATTERNS.image.test(mediaFile.name) ? 'image' :
           MEDIA_PATTERNS.video.test(mediaFile.name) ? 'video' :
           MEDIA_PATTERNS.audio.test(mediaFile.name) ? 'audio' : 'document') :
          detectMessageType(body, mediaFiles);
        
        currentMessage = {
          sender_name: sender,
          timestamp,
          body: body || '',
          message_type: messageType,
          order_index: orderIndex++,
          metadata: {
            original_line: i + 1,
            media_file: mediaFile ? mediaFile.name : null
          }
        };
        
        matched = true;
        break;
      }
    }
    
    if (!matched && currentMessage) {
      currentMessage.body += '\n' + line;
    }
  }
  
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  return messages;
}

export function getChatName(txtFilePath) {
  const fileName = path.basename(txtFilePath, '.txt');
  return fileName.replace(/WhatsApp Chat with /i, '').trim() || 'Unnamed Chat';
}
