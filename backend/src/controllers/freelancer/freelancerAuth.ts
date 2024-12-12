import { Request,Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { Freelancer, IFreelancer } from '../../models/freelancer';
import { AuthenticationRequest } from '../../utils/requests';

const envPath: string = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey: (string | undefined) = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

export const freelancerSignup = async (req: AuthenticationRequest, res: Response) => {
    const { username, password, email } = req.body;
    const freelancer: (IFreelancer | null) = await Freelancer.findOne({ $or: [{ username }, { email }] });
        console.log(req.body);
        if (freelancer) {
            // console.log("I reached here")
            res.status(400).json({ message: "Username Or Email already in use" });
        }
        else {
            const hashPassword: string = await bcrypt.hash(password, 10);
            const newFreelancer: IFreelancer = new Freelancer({
                username,
                password: hashPassword,
                email,
            });
            await newFreelancer.save();
            const token: string = jwt.sign({ userId: newFreelancer.id, username, role: 'FREELANCER' }, secretKey, { expiresIn: '1h' });
            res.status(201).json({ message: "User Account created successfully", role: 'FREELANCER', token: token });
        }
}

export const freelancerLogin = async (req: AuthenticationRequest, res: Response) => {
    const { username, password } = req.body;
    const freelancer: (IFreelancer | null) = await Freelancer.findOne({ username });
    if (!freelancer) {
        res.status(404).json({ message: "Incorrect Credentials" });
    }
    else {
        const isPasswordValid: boolean = await bcrypt.compare(password, freelancer.password);
        if (isPasswordValid) {
            // console.log(secretKey);
            const token: string = jwt.sign({ userId: freelancer._id, username, role: freelancer.role }, secretKey, { expiresIn: '1h' });
            res.json({ role: freelancer.role, token });
        }
    }
}
