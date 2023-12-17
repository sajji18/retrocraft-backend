const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/signup', authController.signup);
// router.post('/login', authController.login);
router.post('/freelancer-login', authController.freelancerLogin);
router.post('/producer-login', authController.producerLogin);
router.get('/user-details', authController.userDetails)

module.exports = router;