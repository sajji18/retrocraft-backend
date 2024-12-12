import { Job, IJob } from "../../models/job";
import { Producer, IProducer } from "../../models/producer";
import { AuthenticationRequest } from "../../utils/requests";
import { Response } from "express";

// SIMPLE CRUD BABYYYYYYYYYY, TODO - Check these routes on POSTMAN + Do Things related to profile building and updating profile => Both Producer and Freelancer
// LETS START BY CREATING YOUR PROFILE => This thing, Most probably will be taken care of in the frontend

// ---------------------------- JOB POST CONTROLLERS -----------------------------

export const createJobPost = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Only producers are allowed to create jobs' });
            return;
        }
        // Need to do this since req.user._id is not any field, either then i need to sign the jwt with the id
        const producer: (IProducer | null) = await Producer.findOne({ username: req?.user?.username });
        if (!producer) {
            res.status(404).json({ message: 'Producer not found' });
            return;
        }
        const job: (IJob) = new Job({
            ...req.body,
            producer: producer?._id,
        });
        await job.save();
        producer?.jobsCreated.push(job._id);
        await producer.save();

        res.status(200).json({ message: 'Job created successfully', job });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Retrieve all post for a specific producer (route designed for a producer's frontend)
// For a freelancer this will be different, he will see posts by all the producers, or those in his connection

export const getAllJobPosts = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        const producer: (IProducer | null) = await Producer.findOne({ username: req?.user?.username });
        console.log(producer)
        const jobs: IJob[] = await Job.find({ producer: producer?._id }).populate('applicants');
        res.status(200).json(jobs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateJobPost = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
            return;
        }
        const jobId: string = req.params.jobId;
        const updateFields: Object = { ...req.body };
        const result: (IJob | null) = await Job.findOneAndUpdate(
            { _id: jobId },
            { $set: updateFields },
            { new: true }
        );
        res.status(200).json({ result , message: 'Job Updated Successfully'});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteJobPost = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Not a Producer' });
        }
        const jobId: string = req.params.jobId;
        const deletedJob: (IJob | null) = await Job.findOneAndDelete({ _id: jobId });
        if (!deletedJob) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }
        res.status(200).json({ message: 'Job Successfully Deleted', deletedJob });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getDetailedJobPost = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        const jobId: string = req.params.jobId;
        const job: (IJob | null) = await Job.findOne({ _id: jobId }).populate('producer');
        const producer: (IProducer | null) = await Producer.findOne({ _id: job?.producer });
        res.status(200).json({ job, producer});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// ---------------------------- PROFILE CONTROLLERS -----------------------------

export const getProducerProfileInfo = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        // if (req.user.role !== 'PRODUCER') {
        //     return res.status(401).json({ message: 'Only Producers allowed to access' });
        // }
        const producer: (IProducer | null) = await Producer.findOne({ username: req?.user?.username });
        const { password, ...profileInfo } = producer?._doc; // important use doc type to get the actual collection fields, otherwise we get some gibberish
        res.status(200).json(profileInfo);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// We can use this route to create profile as well
export const updateProducerProfileInfo = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    try {
        if (req?.user?.role !== 'PRODUCER') {
            res.status(401).json({ message: 'Only Producers allowed to access' });
            return;
        }
        const producer: (IProducer | null) = await Producer.findOne({ username: req?.user?.username });
        const updateFields: Object = { ...req.body };
        console.log(producer);
        console.log(updateFields);
        const result: (IProducer | null) = await Producer.findOneAndUpdate(
            { _id: producer?._id },
            { $set: updateFields },
            { new: true }
        );
        console.log(result);
        res.status(200).json({ updatedProfile: result , message: 'Profile Updated Successfully'});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// const getProfileInfoUsingUsername = async (req: AuthenticationRequest, res: Response): Promise<void> => {
//     try {
//         const { username } = req.params;
//         const producer = await Producer.findOne({ username });
        
//     }
//     catch (error) {
//         res.status(500).json({ message: "Internal Server Error" })
//     }
// }