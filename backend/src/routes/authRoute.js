const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/userDetails', authController.userDetails)

module.exports = router;