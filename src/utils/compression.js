const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Compresses the image and saves it to the specified destination.
 * @param {string} inputPath - The path of the original image to compress.
 * @param {string} outputPath - The path where the compressed image will be saved.
 * @param {number} width - The width to resize the image to (optional).
 * @param {number} height - The height to resize the image to (optional).
 * @param {number} quality - The quality of the compressed image (0 to 100).
 * @returns {Promise<string>} - The path of the compressed image.
 */
const compressImage = async (inputPath, outputPath, width = 800, height = 600, quality = 80) => {
  try {
    // Check if the input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error('Input image does not exist');
    }

    // Compress and resize the image using Sharp
    await sharp(inputPath)
      .resize(width, height, { fit: sharp.fit.inside, withoutEnlargement: true }) // Resize if necessary
      .jpeg({ quality: quality, progressive: true }) // Set the compression quality for jpeg
      .toFile(outputPath);

    console.log(`Image compressed and saved to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error compressing image:', error.message);
    throw error;
  }
};

module.exports = {compressImage};
