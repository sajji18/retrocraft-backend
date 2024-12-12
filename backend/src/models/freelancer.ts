import mongoose, { Document, Schema, Model } from 'mongoose';

interface IFreelancer extends Document {
    _doc: any;
    username: string;
    password: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    hasProfile: boolean;
    bio: string;
    skills: string[];
    experience: {
        jobTitle: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }[];
    education: {
        degree: string;
        school: string;
        graduationYear: string;
    }[];
    freelancerConnections: mongoose.Types.ObjectId[];
    producerConnections: mongoose.Types.ObjectId[];
    connectionRequestsSent: mongoose.Types.ObjectId[];
    connectionRequestsReceived: mongoose.Types.ObjectId[];
    appliedJobs: mongoose.Types.ObjectId[];
}

const freelancerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "FREELANCER" },
    firstName: { type: String },
    lastName: { type: String },
    profileImage: { type: String, default: "" },
    hasProfile: { type: Boolean, default: false }, 
    bio: { type: String },
    skills: [{ type: String }],
    experience: [
        {
        jobTitle: { type: String },
        company: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        description: { type: String },
        },
    ],
    education: [
        {
        degree: { type: String },
        school: { type: String },
        graduationYear: { type: String },
        },
    ],
    freelancerConnections: [{ type: Schema.Types.ObjectId, ref: 'Freelancer' }],
    producerConnections: [{ type: Schema.Types.ObjectId, ref: 'Producer' }],
    // connections: [
    //     { type: Schema.Types.ObjectId, ref: 'Freelancer' },
    //     { type: Schema.Types.ObjectId, ref: 'Producer' }
    // ],
    connectionRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'ConnectionRequest' }],
    connectionRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'ConnectionRequest' }],
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
});

const Freelancer: Model<IFreelancer> = mongoose.model<IFreelancer>('Freelancer', freelancerSchema);

export { Freelancer, IFreelancer };