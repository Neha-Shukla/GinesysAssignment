const DogImage = require('../models/dog');
const fs = require('fs');
const path = require('path');
const { compressImage } = require("../utils/compression")

// Upload a dog picture
exports.uploadDogPic = async (req, res) => {
  try {
    // Check if the file exists in the request
    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    const originalImagePath = req.file.path;
    const compressedImageFilename = `${Date.now()}-${req.file.filename}`; 
    const compressedImagePath = path.join(__dirname, '../../uploads/dogs', compressedImageFilename);

    // Compress the image
    await compressImage(originalImagePath, compressedImagePath, 800, 600, 80);

    // Save the compressed image path to the database
    const dogImage = new DogImage({
      filename: req.file.filename,
      path: compressedImagePath,
    });

    await dogImage.save();

    // Delete the original uncompressed file
    fs.unlinkSync(originalImagePath); 

    res.status(201).send({ id: dogImage._id, message: 'Dog image uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to upload dog picture' });
  }
};

// Delete a dog picture
exports.deleteDogPic = async (req, res) => {
  try {
    const { id } = req.params;
    const dogImage = await DogImage.findById(id);

    if (!dogImage) {
      return res.status(404).send({ error: 'Dog image not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(dogImage.path)) {
      fs.unlinkSync(dogImage.path);
    }

    // Remove the document from MongoDB
    await DogImage.findByIdAndDelete(id);

    res.status(204).send("Dog image deleted successfully"); // No content
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to delete dog picture' });
  }
};

// Update a dog picture
exports.updateDogPic = async (req, res) => {
  try {
    const { id } = req.params;
    const { file } = req;

    if (!file) {
      return res.status(400).send({ error: 'New image file is required' });
    }

    // Find the existing dog image in the database
    const dogImage = await DogImage.findById(id);
    if (!dogImage) {
      fs.unlinkSync(file.path); // Delete the newly uploaded file
      return res.status(404).send({ error: 'Dog image not found' });
    }

    // Compress the newly uploaded image
    const compressedImageFilename = `${Date.now()}-${req.file.filename}`; 
    const compressedImagePath = path.join(__dirname, '../../uploads/dogs', compressedImageFilename);
    await compressImage(file.path, compressedImagePath, 800, 600, 80); // Compress the image

    // Delete the old image if it exists
    if (fs.existsSync(dogImage.path)) {
      fs.unlinkSync(dogImage.path);
    }

    // Update the dog image record with the new compressed file details
    dogImage.filename = file.originalname;
    dogImage.path = compressedImagePath;

    // Save the updated dog image in the database
    await dogImage.save();

    fs.unlinkSync(file.path);

    res.status(200).send({ message: 'Dog image updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to update dog picture' });
  }
};

// Fetch a specific dog picture by ID
exports.fetchDogPic = async (req, res) => {
  try {
    const { id } = req.params;
    const dogImage = await DogImage.findById(id);

    if (!dogImage) {
      return res.status(404).send({ error: 'Dog image not found' });
    }

    res.status(200).send(dogImage);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to fetch dog picture' });
  }
};

// List all uploaded dog pictures
exports.listDogPics = async (req, res) => {
  try {
    const dogImages = await DogImage.find().sort({ uploadedAt: -1 });

    res.status(200).send(dogImages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to list dog pictures' });
  }
};
