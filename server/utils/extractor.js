import yauzl from 'yauzl';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream/promises';

const openZip = promisify(yauzl.open);

export async function extractZip(zipPath, extractPath) {
  return new Promise((resolve, reject) => {
    const extractedFiles = [];
    
    yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
      if (err) return reject(err);
      
      zipfile.readEntry();
      
      zipfile.on('entry', async (entry) => {
        const fullPath = path.join(extractPath, entry.fileName);
        
        if (/\/$/.test(entry.fileName)) {
          await fs.promises.mkdir(fullPath, { recursive: true });
          zipfile.readEntry();
        } else {
          await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
          
          zipfile.openReadStream(entry, async (err, readStream) => {
            if (err) {
              zipfile.readEntry();
              return;
            }
            
            const writeStream = fs.createWriteStream(fullPath);
            
            try {
              await pipeline(readStream, writeStream);
              
              extractedFiles.push({
                name: path.basename(entry.fileName),
                path: fullPath,
                size: entry.uncompressedSize,
                isDirectory: false
              });
              
              zipfile.readEntry();
            } catch (error) {
              console.error('Error extracting file:', error);
              zipfile.readEntry();
            }
          });
        }
      });
      
      zipfile.on('end', () => {
        resolve(extractedFiles);
      });
      
      zipfile.on('error', reject);
    });
  });
}

export async function findChatFile(extractPath) {
  const files = await fs.promises.readdir(extractPath, { recursive: true });
  
  const txtFiles = files.filter(f => f.endsWith('.txt'));
  
  if (txtFiles.length === 0) {
    throw new Error('No .txt chat file found in ZIP');
  }
  
  if (txtFiles.length === 1) {
    return path.join(extractPath, txtFiles[0]);
  }
  
  let largestFile = txtFiles[0];
  let largestSize = 0;
  
  for (const file of txtFiles) {
    const filePath = path.join(extractPath, file);
    const stats = await fs.promises.stat(filePath);
    if (stats.size > largestSize) {
      largestSize = stats.size;
      largestFile = file;
    }
  }
  
  return path.join(extractPath, largestFile);
}

export async function findMediaFiles(extractPath) {
  const mediaFiles = [];
  
  async function scanDirectory(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await scanDirectory(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const mediaExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mkv', '.webm', '.opus', '.ogg', '.mp3', '.m4a', '.aac', '.wav', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar'];
        
        if (mediaExts.includes(ext)) {
          const stats = await fs.promises.stat(fullPath);
          mediaFiles.push({
            name: entry.name,
            path: fullPath,
            size: stats.size,
            ext
          });
        }
      }
    }
  }
  
  await scanDirectory(extractPath);
  return mediaFiles;
}
