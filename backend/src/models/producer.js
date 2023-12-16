const mongoose = require('mongoose');

const producerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "PRODUCER" },
    hasProfile: { type: Boolean, default: false },
    companyName: { type: String },
    industry: { type: String },
    about: { type: String },
    jobsCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }],
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
    ]
});

const Producer = mongoose.model('Producer', producerSchema);

module.exports = {
    Producer
}