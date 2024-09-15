const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');  // Import the client controller

// Define route to add a client (POST request)
router.post('/', clientController.addClient);  // Route to add a client

// Define route to get all clients (GET request)
router.get('/', clientController.getAllClients);  // Route to get all clients

module.exports = router;



