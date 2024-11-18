const express = require('express');
const multer = require('multer');
const dogsController = require('../controllers/dogsController');
const verifyToken = require("./../middlewares/auth")
const path = require("path")
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/dogs/'); // Save files to the uploads/dogs directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const extension = path.extname(file.originalname); // Extract the file extension
      cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
    },
  });
  
  const upload = multer({ storage });

/**
 * @swagger
 * /dogs:
 *   get:
 *     summary: Fetch a single dog image by ID
 *     tags: [Dogs]
 *     responses:
 *       200:
 *         description: Dog image metadata
 */

// List all dog pictures
router.get('/', dogsController.listDogPics);

/**
 * @swagger
 * /dogs/{id}:
 *   get:
 *     summary: Fetch a single dog image by ID
 *     tags: [Dogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dog image metadata
 */
router.get('/:id', dogsController.fetchDogPic);

/**
 * @swagger
 * /dogs:
 *   post:
 *     summary: Upload a new dog image
 *     tags: [Dogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dogImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Dog image uploaded successfully
 */
router.post('/', upload.single('dogImage'), dogsController.uploadDogPic);

/**
 * @swagger
 * /dogs/{id}:
 *   put:
 *     summary: Update an existing dog image
 *     tags: [Dogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               dogImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Dog image updated successfully
 */
router.put('/:id', upload.single('dogImage'), dogsController.updateDogPic);

/**
 * @swagger
 * /dogs/{id}:
 *   delete:
 *     summary: Delete a dog image by ID
 *     tags: [Dogs]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Dog image deleted successfully
 */
router.delete('/:id', dogsController.deleteDogPic);

module.exports = router;
