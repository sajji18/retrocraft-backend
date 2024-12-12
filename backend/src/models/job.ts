import mongoose, { Document, Schema, Model } from 'mongoose';

interface IJob extends Document {
    producer: mongoose.Types.ObjectId;
    title: string;
    description: string;
    requirements: string[];
    skillsRequired: string[];
    employmentType:'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
    location: string;
    salary: number;
    postedDate: Date;
    applicants: mongoose.Schema.Types.ObjectId[];
}

const jobSchema = new mongoose.Schema({
    producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skillsRequired: [{ type: String }],
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'] },
    location: { type: String },
    salary: { type: Number },
    postedDate: { type: Date, default: Date.now },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' }],
});

const Job: Model<IJob> = mongoose.model<IJob>('Job', jobSchema);

export { Job, IJob };