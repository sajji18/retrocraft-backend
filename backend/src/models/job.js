const mongoose = require('mongoose');

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

const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = {
    JobPost
}