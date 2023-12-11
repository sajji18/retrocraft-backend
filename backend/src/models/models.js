const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hasProfile: { type: Boolean, default: false }, // Indicates whether the user has completed the profile
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
    linkedinProfile: { type: String },
    profileImage: { type: String },
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }],
});


const producerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    industry: { type: String },
    about: { type: String },
    jobsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }],
});


const jobPostSchema = new mongoose.Schema({
    producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    skillsRequired: [{ type: String }],
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'] },
    location: { type: String },
    salary: { type: Number },
    postedDate: { type: Date, default: Date.now },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', userSchema);
const Producer = mongoose.model('Producer', producerSchema);
const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = {
    User, 
    Producer,
    JobPost
}