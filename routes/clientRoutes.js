const express = require('express');
const { addClient } = require('../controllers/clientController');

const router = express.Router();

router.post('/add', addClient);

module.exports = router;
