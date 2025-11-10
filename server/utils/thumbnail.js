import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export async function generateThumbnail(inputPath, outputPath, options = {}) {
  const { width = 300, height = 300, fit = 'cover' } = options;
  
  try {
    await sharp(inputPath)
      .resize(width, height, { fit })
      .jpeg({ quality: 80 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
}

export async function getImageDimensions(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height
    };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return { width: null, height: null };
  }
}

export async function generateVideoThumbnail(videoPath, outputPath) {
  return null;
}
