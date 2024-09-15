const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');  // Import the pet controller

// Middleware to handle file uploads
const upload = petController.upload;

// Define routes for pets
router.post('/', upload.array('documents', 10), petController.addPet);  // Route to add a pet with file upload

module.exports = router;

