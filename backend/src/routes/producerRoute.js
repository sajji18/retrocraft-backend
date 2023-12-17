const express = require('express');
const router = express.Router();
const producerAuth = require('../controllers/producer/producerAuth');
const producerControllers = require('../controllers/producer/producerControllers');

// router.post('/details', producerControllers.producerDetails)
router.post('/login', producerAuth.producerLogin);

module.exports = router;