import { Response } from 'express';
import { AuthenticationRequest } from '../../utils/requests';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Freelancer, IFreelancer } from '../../models/freelancer';
import { Job, IJob } from '../../models/job';
import secretKey from '../../utils/secret';
import mongoose from 'mongoose';

// Freelancer Profile Controllers
export const getFreelancerProfileInfo = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        // if (req.user.role !== 'FREELANCER') {
        //     return res.status(401).json({ message: 'Only Freelancer allowed to access' });
        // }
        const freelancer: (IFreelancer | null) = await Freelancer.findOne({ username: req?.user?.username });
        const { password, ...profileInfo } = freelancer?._doc; // important use ._doc to get the actual collection fields, otherwise we get some gibberish
        res.status(200).json(profileInfo);
        return;
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const updateFreelancerProfileInfo = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        // if (req.user.role !== 'FREELANCER') {
        //     return res.status(401).json({ message: 'Only Freelancers allowed to access' });
        // }
        const freelancer: (IFreelancer | null) = await Freelancer.findOne({ username: req?.user?.username });
        const updateFields: Object = { ...req.body };
        console.log(freelancer);
        console.log(updateFields);
        const result: (IFreelancer | null) = await Freelancer.findOneAndUpdate(
            { _id: freelancer?._id },
            { $set: updateFields },
            { new: true }
        );
        console.log(result);
        res.status(200).json({ updatedProfile: result, message: "Profile Updated Successfully"});
        return;
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Job Controllers for Freelancer
export const getJobPostsFreelancer = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        // console.log('hello');
        // console.log(req.user);
        // if (req.user.role !== 'FREELANCER') {
        //     return res.status(401).json({ message: 'Only Freelancers allowed to access' });
        // }
        // console.log('hello');
        const jobPosts: IJob[] = await Job.find({}).populate('producer');
        // console.log(jobPosts)
        res.json(jobPosts);
        return;
    }
    catch (error) {
        res.status(400).json({ message: "Error fetching job posts" })
    } 
}


// Job Apply Controllers for Freelancers
export const checkIfApplied = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'FREELANCER') {
            res.status(401).json({ message: 'Only Freelancers can apply' });
            return;
        }
        const jobId: string = req.params.jobId;
        const freelancer: (IFreelancer | null) = await Freelancer.findOne({ username: req.user.username });
        const jobToCheckIfApplied: (IJob | null) = await Job.findOne({ _id: jobId });

        const applied: (boolean | undefined) = jobToCheckIfApplied?.applicants.includes(freelancer?._id);
        if (applied) {
            res.json({ message: "User has already applied for this job", applied: applied });
            return;
        } 
        res.json({ message: "User has not applied for this job", applied: applied });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error in checking applicant for the job post" });
    }
}

export const applyJobPost = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'FREELANCER') {
            res.status(401).json({ message: 'Only Freelancers can apply' });
            return;
        }
        const jobId: string = req.params.jobId;
        const freelancer: (IFreelancer | null) = await Freelancer.findOne({ username: req.user.username });
        const jobToApply: (IJob | null) = await Job.findOne({ _id: jobId });

        const alreadyApplied: (boolean | undefined) = jobToApply?.applicants.includes(freelancer?._id);
        if (alreadyApplied) {
            res.json({ message: "User has already applied for this job" });
            return;
        }
        if (!jobToApply) {
            res.status(404).json({ message: "Job Post not found" });
            return;
        }
        if (!freelancer) {
            res.status(404).json({ message: "Freelancer not found" });
            return;
        }
        jobToApply?.applicants.push(freelancer?._id);
        console.log(jobToApply?.applicants);
        freelancer?.appliedJobs.push(new mongoose.Types.ObjectId(jobId));
        console.log(freelancer?.appliedJobs);

        await jobToApply.save();
        await freelancer.save();

        res.json({ message: "Successfully applied for the job" })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in applying to job post" });
    }
}

export const unapplyToJobPost = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'FREELANCER') {
            res.status(401).json({ message: 'Only Freelancers can apply' });
            return;
        }
        const jobId: string = req.params.jobId
        const freelancer: (IFreelancer | null) = await Freelancer.findOne({ username: req.user.username });
        const jobToUnapply: (IJob | null) = await Job.findOne({ _id: jobId });
        if (!jobToUnapply) {
            res.status(404).json({ message: "Job Post not found" });
            return;                             
        }
        if (!freelancer) {
            res.status(404).json({ message: "Freelancer not found" });
            return;
        }

        const freelancerIdString: string = freelancer?._id.toString();
        jobToUnapply.applicants = jobToUnapply?.applicants.filter(
            applicantId => applicantId.toString() !== freelancerIdString
        );
        freelancer.appliedJobs = freelancer.appliedJobs.filter(
            appliedJobId => appliedJobId.toString() !== jobId
        );
        console.log(freelancer.appliedJobs);
        console.log(jobToUnapply.applicants);
        await jobToUnapply.save();
        await freelancer.save();

        res.json({ message: "Successfully unapplied for the job" })
    }
    catch (error) {
        res.status(500).json({ message: "Error in unapplying to job post" });
    }
}

export const getAppliedJobPosts = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'FREELANCER') {
            res.status(401).json({ message: 'Only Freelancers can apply' });
            return;
        }
        // console.log("hello")
        const freelancer:  (IFreelancer | null) = await Freelancer.findOne({ username: req.user.username }).populate('appliedJobs');
        // console.log(freelancer.appliedJobs);
        res.json(freelancer?.appliedJobs);
    }
    catch (error) {
        // console.error(error)
        res.status(500).json({ message: "Error Getting the job posts" });
    }
}