const request = require('supertest');
const app = require('../../app'); // Assuming your Express app is in 'app.js'
const mongoose = require('mongoose');
const mockingoose = require('mockingoose');
const DogImage = require('../models/dog'); // Actual model
const fs = require("fs")

describe('Dogs Controller Tests', () => {
  beforeAll(async () => {
    const url = 'mongodb://localhost:27017/dogdb_test';
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /dogs', () => {
    it('should upload a dog image and return success', async () => {
      const mockFilePath = './uploads/dogs/1731946661136-dogImage-1731946660908-74374125.png';
      const mockFile = {
        fieldname: 'dogImage',
        originalname: '1731946661136-dogImage-1731946660908-74374125.png',
        encoding: '7bit',
        mimetype: 'image/png',
        path: mockFilePath,
        size: 1024,
      };

      const response = await request(app).post('/dogs').attach('dogImage', mockFile.path);
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Dog image uploaded successfully');
    });

    it('should return error if no file is uploaded', async () => {
      const response = await request(app).post('/dogs');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('No file uploaded');
    });
  });

  describe('GET /dogs/:id', () => {
    it('should fetch a specific dog image by ID', async () => {
      const dogId = '60d21b4667d0d8992e610c85';
      mockingoose(DogImage).toReturn(
        { _id: dogId, filename: 'dog-123.jpg', path: './uploads/dogs/dog-123.jpg' },
        'findOne'
      );

      const response = await request(app).get(`/dogs/${dogId}`);
      expect(response.status).toBe(200);
      expect(response.body.filename).toBe('dog-123.jpg');
    });

    it('should return error if dog image is not found', async () => {
      const dogId = '60d21b4667d0d8992e610c85';
      mockingoose(DogImage).toReturn(null, 'findOne');

      const response = await request(app).get(`/dogs/${dogId}`);
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Dog image not found');
    });
  });

    it('should delete a dog image', async () => {
      const dogId = '60d21b4667d0d8992e610c85';
      
      mockingoose(DogImage).toReturn({
        _id: dogId,
        filename: 'dog-123.jpg',
        path: './uploads/dogs/dog-123.jpg',
      }, 'findOne');
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {}); // Mock fs.unlinkSync

      const response = await request(app).delete(`/dogs/${dogId}`);
      expect(response.status).toBe(204); // No Content
    });

    it('should list all dog images', async () => {
        mockingoose(DogImage).toReturn([
          { filename: 'dog-123.jpg', path: './uploads/dogs/dog-123.jpg' },
          { filename: 'dog-456.jpg', path: './uploads/dogs/dog-456.jpg' }
        ], 'find');
  
        const response = await request(app).get('/dogs');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
      });
});
