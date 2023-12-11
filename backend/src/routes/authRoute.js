const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/signup', authController.userSignup);
router.post('/login', authController.userLogin);

module.exports = router;