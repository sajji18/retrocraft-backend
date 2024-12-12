import mongoose, { Document, Schema, Model } from "mongoose";

interface IConnectionRequest extends Document {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    senderType: 'Freelancer' | 'Producer';
    receiverType: 'Freelancer' | 'Producer';
    status: 'pending' | 'accepted' | 'rejected';
}

const connectionRequestSchema: Schema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'senderType',
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverType',
    },
    senderType: {
        type: String,
        required: true,
        enum: ['Freelancer', 'Producer'], 
    },
    receiverType: {
        type: String,
        required: true,
        enum: ['Freelancer', 'Producer'], 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

const ConnectionRequest: Model<IConnectionRequest> = mongoose.model<IConnectionRequest>('ConnectionRequest', connectionRequestSchema);

export { ConnectionRequest };
