const express = require('express');
const router = express.Router();
const freelancerAuth = require('../controllers/freelancer/freelancerAuth');
const freelancerControllers = require('../controllers/freelancer/freelancerControllers');
const jwtAuth = require('../middlewares/jwtAuth');

// Auth Routes
router.post('/signup', freelancerAuth.freelancerSignup);

router.post('/login', freelancerAuth.freelancerLogin);

// Job Post Routes
router.get('/get-job-posts', jwtAuth.jwtAuthentication, freelancerControllers.getJobPostsFreelancer)

// Profile Routes
router.get('/profile', jwtAuth.jwtAuthentication, freelancerControllers.getFreelancerProfileInfo);

router.put('/profile', jwtAuth.jwtAuthentication, freelancerControllers.updateFreelancerProfileInfo)

module.exports = router;