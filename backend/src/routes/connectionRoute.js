const express = require('express');
const router = express.Router();
const utils = require('../utils/connectionControllers');
const jwtAuth = require('../middlewares/jwtAuth');

router.post('/send-connection-request', jwtAuth.jwtAuthentication, utils.sendConnectionRequest);

router.patch('/accept-connection-request/:connectionRequestId', jwtAuth.jwtAuthentication, utils.acceptConnectionRequest);

router.patch('/reject-connection-request/:connectionRequestId', jwtAuth.jwtAuthentication, utils.rejectConnectionRequest);

router.get('/all-outgoing-connection-requests', jwtAuth.jwtAuthentication, utils.allOutgoingConnectionRequests);

router.get('/all-incoming-connection-requests', jwtAuth.jwtAuthentication, utils.allIncomingConnectionRequests);

module.exports = router;