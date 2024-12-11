import { NextFunction, Request, Response, Router } from 'express';
import utils from '../utils/details';

const router: Router = Router();

router.get('/details', utils.details);
router.get('/profile-owner-details/:role/:username', utils.profileOwnerDetails)

// router.post('/signup', authController.signup);
// // router.post('/login', authController.login);
// router.post('/freelancer-login', authController.freelancerLogin);
// router.post('/producer-login', authController.producerLogin);
// router.get('/user-details', authController.userDetails)

module.exports = router;