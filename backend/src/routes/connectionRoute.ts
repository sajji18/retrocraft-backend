import { NextFunction, Request, Response, Router } from 'express';
import utils from '../utils/connectionControllers';
import jwtAuthentication from '../middlewares/jwtAuth';

const router: Router = Router();

router.post('/send-connection-request', jwtAuthentication, utils.sendConnectionRequest);
router.patch('/accept-connection-request/:connectionRequestId', jwtAuthentication, utils.acceptConnectionRequest);
router.patch('/reject-connection-request/:connectionRequestId', jwtAuthentication, utils.rejectConnectionRequest);
router.get('/all-outgoing-connection-requests', jwtAuthentication, utils.allSentConnectionRequests);
router.get('/all-incoming-connection-requests', jwtAuthentication, utils.allReceivedConnectionRequests);
router.get('/check-connection/:role/:username', jwtAuthentication, utils.checkConnected);

module.exports = router;