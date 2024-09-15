const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');  // Import the client controller

// Define routes for clients
router.post('/', clientController.addClient);  // Route to add a client

module.exports = router;


