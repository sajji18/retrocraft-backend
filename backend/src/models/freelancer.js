const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "FREELANCER" },
    firstName: { type: String },
    lastName: { type: String },
    profileImage: { type: String },
    hasProfile: { type: Boolean, default: false }, 
    bio: { type: String },
    skills: [{ type: String }],
    experience: [
        {
        jobTitle: { type: String },
        company: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
        },
    ],
    education: [
        {
        degree: { type: String },
        school: { type: String },
        graduationYear: { type: Number },
        },
    ],
    connections: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }
    ],
    connectionRequests: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' },
            status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
        }
    ],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = {
    Freelancer, 
}