import { NextFunction, Request, Response, Router } from 'express';
import { 
    producerLogin, 
    producerSignup 
} from '../controllers/producer/producerAuth';
import {
    createJobPost,
    getAllJobPosts,
    getDetailedJobPost,
    updateJobPost,
    deleteJobPost,
    getProducerProfileInfo,
    updateProducerProfileInfo
} from '../controllers/producer/producerControllers'
import { jwtAuthentication } from '../middlewares/jwtAuth';

const router: Router = Router();

// Authentication Routes - Done
router.post('/signup', producerSignup);
router.post('/login', producerLogin);

// Job Post Routes - Done
router.post('/jobs', jwtAuthentication, createJobPost);
router.get('/jobs', jwtAuthentication, getAllJobPosts);
router.get('/jobs/:jobId', jwtAuthentication, getDetailedJobPost)
router.put('/jobs/:jobId', jwtAuthentication, updateJobPost);
router.delete('/jobs/:jobId', jwtAuthentication, deleteJobPost);

// Profile Routes - Done
router.get('/profile', jwtAuthentication, getProducerProfileInfo);
router.put('/profile', jwtAuthentication, updateProducerProfileInfo)

// router.get('/profile/:username', jwtAuth.jwtAuthentication, producerControllers)

module.exports = router;