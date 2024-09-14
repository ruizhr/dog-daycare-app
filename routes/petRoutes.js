const express = require('express');
const { addPet, upload } = require('../controllers/petController');

const router = express.Router();

// Use multer middleware to handle file uploads
router.post('/add', upload.array('documents'), addPet);

module.exports = router;
