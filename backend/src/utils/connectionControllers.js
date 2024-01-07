const { ConnectionRequest } = require('../models/connection');
const { Freelancer } = require('../models/freelancer');
const { Producer } = require('../models/producer');

const sendConnectionRequest = async (req, res) => {
    try {
        const { receiverId, receiverType } = req.body;
        const existingRequest = await ConnectionRequest.findOne({
            $or: [
            { senderId: req.user.userId, receiverId, status: { $in: ['pending', 'accepted'] } },
            { senderId: receiverId, receiverId: req.user.userId, status: { $in: ['pending', 'accepted'] } }
            ]
        });
        if (existingRequest) {
            if (existingRequest.status === 'pending') {
                return res.status(400).json({ message: 'Connection request already pending' });
            } 
            else if (existingRequest.status === 'accepted') {
                return res.status(400).json({ message: 'Users are already connected' });
            }
        }

        const connectionRequest = new ConnectionRequest({
            senderId: req.user.userId,
            senderType: req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1).toLowerCase(),
            receiverId,
            receiverType: receiverType.charAt(0).toUpperCase() + receiverType.slice(1).toLowerCase(),
            status: 'pending'
        });
        await connectionRequest.save();

        const senderModel = req.user.role === 'FREELANCER' ? Freelancer : Producer;
        const receiverModel = receiverType === 'Freelancer' ? Freelancer : Producer;
        
        console.log(senderModel);
        console.log(receiverModel);

        const sender = await senderModel.findById(req.user.userId);
        const receiver = await receiverModel.findById(receiverId);

        console.log(sender);

        sender.connectionRequestsSent.push(connectionRequest._id);
        await sender.save();
        receiver.connectionRequestsReceived.push(connectionRequest._id);
        await receiver.save();

        res.status(201).json({ message: 'Connection Request Sent Successfully' });
        } 
        catch (error) {
            console.error('Error sending connection request:', error);
            res.status(500).json({ error: 'Internal Server Error' });
    }
};

const acceptConnectionRequest = async (req, res) => {
    try {
        const connectionRequestId = req.params.connectionRequestId;
        const connectionRequest = await ConnectionRequest.findById(connectionRequestId);
        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found' });
        }
        // console.log(connectionRequest.receiverId);
        // console.log(req.user.userId);
        if (connectionRequest.receiverId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized to accept this request' });
        }
        if (connectionRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request cannot be accepted because it is not pending' });
        }

        connectionRequest.status = 'accepted';
        await connectionRequest.save()

        const senderModel = connectionRequest.senderType === 'Freelancer' ? Freelancer : Producer;
        const receiverModel = connectionRequest.receiverType === 'Freelancer' ? Freelancer : Producer;

        const sender = await senderModel.findById(connectionRequest.senderId);
        const receiver = await receiverModel.findById(connectionRequest.receiverId);

        sender.connectionRequestsSent.pull(connectionRequestId);
        receiver.connectionRequestsReceived.pull(connectionRequestId);

        if (connectionRequest.senderType === 'Freelancer') {
            receiver.freelancerConnections.push(connectionRequest.senderId);
        } 
        else if (connectionRequest.senderType === 'Producer') {
            receiver.producerConnections.push(connectionRequest.senderId);
        }

        if (connectionRequest.receiverType === 'Freelancer') {
            sender.freelancerConnections.push(connectionRequest.receiverId);
        } 
        else if (connectionRequest.receiverType === 'Producer') {
            sender.producerConnections.push(connectionRequest.receiverId);
        }

        await receiver.save();
        await sender.save();

        res.status(200).json({ message: 'Connection request accepted successfully' });
    } 
    catch (error) {
        console.error('Error accepting connection request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const rejectConnectionRequest = async (req, res) => {
    try {
        const connectionRequestId = req.params.connectionRequestId;
        const connectionRequest = await ConnectionRequest.findById(connectionRequestId);

        if (!connectionRequest) {
            return res.status(404).json({ message: 'Connection request not found' });
        }
        if (connectionRequest.receiverId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Unauthorized to reject this request' });
        }
        if (connectionRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Connection request cannot be rejected because it is not pending' });
        }
        connectionRequest.status = 'rejected';
        await connectionRequest.save();
    
        const senderModel = connectionRequest.senderType === 'Freelancer' ? Freelancer : Producer;
        const receiverModel = connectionRequest.receiverType === 'Freelancer' ? Freelancer : Producer;
    
        const sender = await senderModel.findById(connectionRequest.senderId);
        const receiver = await receiverModel.findById(connectionRequest.receiverId);

        sender.connectionRequestsSent.pull(connectionRequestId);
        receiver.connectionRequestsReceived.pull(connectionRequestId);

        await receiver.save();
        await sender.save();
    
        res.status(200).json({ message: 'Connection request rejected successfully' });
    } 
    catch (error) {
        console.error('Error rejecting connection request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}

const allSentConnectionRequests = async (req, res) => {
    // All Sent connection requests pending against other users
    try{
        const role = req.user.role;
        const userModel = role === 'FREELANCER' ? Freelancer : Producer;

        const user = await userModel.findById(req.user.userId);
        const connectionRequestsSent = user.connectionRequestsSent;

        res.status(200).json(connectionRequestsSent);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const allReceivedConnectionRequests = async (req, res) => {
    // All Received connection requests pending against the user
    try{
        const role = req.user.role;
        const userModel = role === 'FREELANCER' ? Freelancer : Producer;

        const user = await userModel.findById(req.user.userId);
        const connectionRequestsReceived = user.connectionRequestsReceived;

        res.status(200).json(connectionRequestsReceived);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const checkConnected = async (req, res) => {
    
}

const removeConnection = async (req, res) => {

}

module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    allSentConnectionRequests,
    allReceivedConnectionRequests,
    checkConnected,
    removeConnection,
}