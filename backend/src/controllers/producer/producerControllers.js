const { Job } = require('../../models/job');
const { Producer } = require('../../models/producer');

// SIMPLE CRUD BABYYYYYYYYYY, TODO - Check these routes on POSTMAN + Do Things related to profile building and updating profile => Both Producer and Freelancer
// LETS START BY CREATING YOUR PROFILE => This thing, Most probably will be taken care of in the frontend

const createJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            return res.status(401).json({ message: 'Only producers are allowed to create jobs' });
        }
        // Need to do this since req.user._id is not any field, either then i need to sign the jwt with the id
        const producer = await Producer.findOne({ username: req.user.username });
        const job = new Job({
            ...req.body,
            producer: producer._id,
        });
        await job.save();
        return res.status(200).json({ message: 'Job created successfully', jobId: job._id });
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Retrieve all post for a specific producer (route designed for a producer's frontend)
// For a freelancer this will be different, he will see posts by all the producers, or those in his connection

const getAllJobPosts = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
        }
        const producer = await Producer.findOne({ username: req.user.username });
        console.log(producer)
        const jobs = await Job.find({ producer: producer._id });
        return res.status(200).json(jobs);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
        }
        const jobId = req.params.jobId;
        const updateFields = { ...req.body };
        const result = await Job.findOneAndUpdate(
            { _id: jobId },
            { $set: updateFields },
            { new: true }
        );
        res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const deleteJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
        }
        const jobId = req.params.jobId;
        const deletedJob = await Job.findOneAndDelete({ _id: jobId });
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job Successfully Deleted', deletedJob });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getDetailedJobPost = async (req, res) => {
    try {
        if (req.user.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
        }
        const jobId = req.params.jobId;
        const job = await Job.findOne({ _id: jobId });
        return res.status(200).json(job);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// title: { type: String, required: true },
// description: { type: String, required: true },
// requirements: [{ type: String }],
// skillsRequired: [{ type: String }],
// employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'] },
// location: { type: String },
// salary: { type: Number },
// postedDate: { type: Date, default: Date.now },
// applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

module.exports = {
    createJobPost,
    getAllJobPosts,
    updateJobPost,
    deleteJobPost,
    getDetailedJobPost
}