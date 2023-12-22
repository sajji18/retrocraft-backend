const { Freelancer } = require('../../models/freelancer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
const { Job } = require('../../models/job');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;

// const freelancerDetails = async (req, res) => {
//     const token = req.headers.authorization.split(' ')[1]; 
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     const decoded = jwt.verify(token, secretKey, { complete: true }); 
//     const freelancer = await Freelancer.findOne({ username: decoded.payload.username });
//     if (!freelancer) {
//         res.status(401).json({ message: "Unauthorized" });
//     }
//     else {
//         res.json({ user: decoded });
//     }
// }


// Freelancer Profile Controllers
const getFreelancerProfileInfo = async (req, res) => {
    try {
        if (req.user.role !== 'FREELANCER') {
            return res.status(401).json({ message: 'Only Freelancer allowed to access' });
        }
        const freelancer = await Freelancer.findOne({ username: req.user.username });
        const { password, ...profileInfo } = freelancer._doc; // important use ._doc to get the actual collection fields, otherwise we get some gibberish
        return res.status(200).json(profileInfo);
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateFreelancerProfileInfo = async (req, res) => {
    try {
        if (req.user.role !== 'FREELANCER') {
            return res.status(401).json({ message: 'Only Freelancers allowed to access' });
        }
        const freelancer = await Freelancer.findOne({ username: req.user.username });
        const updateFields = { ...req.body };
        console.log(freelancer);
        console.log(updateFields);
        const result = await Freelancer.findOneAndUpdate(
            { _id: freelancer._id },
            { $set: updateFields },
            { new: true }
        );
        console.log(result);
        res.status(200).json(result);
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Job Controllers for Freelancer
const getJobPostsFreelancer = async (req, res) => {
    try {
        // console.log('hello');
        // console.log(req.user);
        if (req.user.role !== 'FREELANCER') {
            return res.status(401).json({ message: 'Only Freelancers allowed to access' });
        }
        // console.log('hello');
        const jobPosts = await Job.find({});
        // console.log(jobPosts)
        res.json(jobPosts);
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching job posts" })
    } 
}

const applyJobPost = async (req, res) => {
    
}

module.exports = {
    // freelancerDetails
    getFreelancerProfileInfo,
    updateFreelancerProfileInfo,
    getJobPostsFreelancer
}