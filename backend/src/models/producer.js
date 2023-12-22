const mongoose = require('mongoose');

const producerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "PRODUCER" },
    hasProfile: { type: Boolean, default: false },
    profilePicture: {type: String, default: ""},
    companyName: { type: String, default: '' },
    industry: { type: String, default: '' },
    about: { type: String, default: '' },
    jobsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    connections: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
        { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }
    ],
    connectionRequests: [
        {
            freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer' },
            producer: { type: mongoose.Schema.Types.ObjectId, ref: 'Producer' },
            status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
        }
    ]
});

const Producer = mongoose.model('Producer', producerSchema);

module.exports = {
    Producer
}