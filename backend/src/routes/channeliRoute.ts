import { NextFunction, Request, Response, Router } from 'express';
import utils from '../utils/channeliControllers';

const router: Router = Router();

router.get('/user/login', utils.OAuthView);
router.get('/auth/callback', utils.OAuthCallback);

module.exports = router;