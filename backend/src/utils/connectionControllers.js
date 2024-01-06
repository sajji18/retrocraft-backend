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
        connectionRequest.status = 'accepted';
        await connectionRequest.save()

        const senderModel = connectionRequest.senderType === 'Freelancer' ? Freelancer : Producer;
        const receiverModel = connectionRequest.receiverType === 'Freelancer' ? Freelancer : Producer;

        const sender = await senderModel.findById(connectionRequest.senderId);
        const receiver = await receiverModel.findById(connectionRequest.receiverId);

        receiver.connections.push(connectionRequest.senderId);
        await receiver.save();

        sender.connections.push(connectionRequest.receiverId);
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
        
        receiver.connections.pull(connectionRequest.senderId);
        await receiver.save();
        sender.connections.pull(connectionRequest.receiverId);
        await sender.save();
    
        res.status(200).json({ message: 'Connection request rejected successfully' });
    } 
    catch (error) {
        console.error('Error rejecting connection request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
}

const allOutgoingConnectionRequests = async (req, res) => {
    // All outgoing connection requests pending against other users
    try{
        const senderType = req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1).toLowerCase()
        // console.log(req.user);
        // console.log(senderType);
        const connectionRequests = await ConnectionRequest.find({ 
                senderId: req.user.userId, 
                senderType: senderType, 
                status: 'pending' 
            }  
        );
        res.status(200).json(connectionRequests);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const allIncomingConnectionRequests = async (req, res) => {
    // All incoming connection requests pending against the user
    try{
        const connectionRequests = await ConnectionRequest.find({ 
                receiverId: req.user.userId, 
                receiverType: req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1).toLowerCase(), 
                status: 'pending' 
            }  
        );
        res.status(200).json(connectionRequests);
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
    allOutgoingConnectionRequests,
    allIncomingConnectionRequests,
    checkConnected,
    removeConnection,
}