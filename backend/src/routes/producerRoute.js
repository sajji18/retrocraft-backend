const express = require('express');
const router = express.Router();
const producerAuth = require('../controllers/producer/producerAuth');
const producerControllers = require('../controllers/producer/producerControllers');
const jwtAuth = require('../middlewares/jwtAuth')

router.post('/signup', producerAuth.producerSignup);


router.post('/login', producerAuth.producerLogin);


router.post('/jobs', jwtAuth.jwtAuthentication, producerControllers.createJobPost);


router.get('/jobs', jwtAuth.jwtAuthentication, producerControllers.getAllJobPosts);


router.get('/jobs/:jobId', jwtAuth.jwtAuthentication, producerControllers.getDetailedJobPost)


router.put('/jobs/:jobId', jwtAuth.jwtAuthentication, producerControllers.updateJobPost);


router.delete('/jobs/:jobId', jwtAuth.jwtAuthentication, producerControllers.deleteJobPost);


module.exports = router;