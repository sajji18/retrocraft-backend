import { NextFunction, Response, Router } from 'express';
import { 
    freelancerLogin, 
    freelancerSignup 
} from '../controllers/freelancer/freelancerAuth';
import {
    getJobPostsFreelancer,
    getAppliedJobPosts,
    checkIfApplied,
    applyJobPost,
    unapplyToJobPost,
    getFreelancerProfileInfo,
    updateFreelancerProfileInfo
} from '../controllers/freelancer/freelancerControllers'
import jwtAuthentication from '../middlewares/jwtAuth';

const router: Router = Router();

// Auth Routes
router.post('/signup', freelancerSignup);
router.post('/login', freelancerLogin);

// Job Post Routes
router.get('/get-job-posts', jwtAuthentication, getJobPostsFreelancer);
router.get('/get-applied-job-posts', jwtAuthentication, getAppliedJobPosts);
router.get('/job/apply/:jobId', jwtAuthentication, checkIfApplied);
router.post('/job/apply/:jobId', jwtAuthentication, applyJobPost);
router.delete('/job/apply/:jobId', jwtAuthentication, unapplyToJobPost);

// Profile Routes
router.get('/profile', jwtAuthentication, getFreelancerProfileInfo);
router.put('/profile', jwtAuthentication, updateFreelancerProfileInfo);

module.exports = router;