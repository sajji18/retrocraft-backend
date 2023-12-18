const express = require('express');
const router = express.Router();
const freelancerAuth = require('../controllers/freelancer/freelancerAuth');
const freelancerControllers = require('../controllers/freelancer/freelancerControllers');

router.post('/signup', freelancerAuth.freelancerSignup)


router.post('/login', freelancerAuth.freelancerLogin);


router.get('/details', freelancerControllers.freelancerDetails)


module.exports = router;