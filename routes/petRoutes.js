const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');  // Import the pet controller

// Middleware to handle file uploads
const upload = petController.upload;

// Define route to add a pet (POST request)
router.post('/', upload.array('documents', 10), petController.addPet);  // Route to add a pet with file upload

// Define route to get all pets (GET request)
router.get('/', petController.getAllPets);  // Route to get all pets

module.exports = router;


