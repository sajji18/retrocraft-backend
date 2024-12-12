import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secretKey from '../../utils/secret';
import { Producer, IProducer } from '../../models/producer';
import { Response } from 'express';
import { AuthenticationRequest } from '../../utils/requests';

export const producerSignup = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    const { username, password, email } = req.body;
    const producer: (IProducer | null) = await Producer.findOne({ $or: [{ username }, { email }] });
    // console.log(req.body);
    if (producer) {
        res.status(400).json({ message: "Username Or Email already in use" });
        return;
    }
    else {
        const hashPassword: string = await bcrypt.hash(password, 10);
        const newProducer: IProducer = new Producer({
        username,
        password: hashPassword,
        email,
        })
        await newProducer.save();
        const token: string = jwt.sign({ userId: newProducer.id, username, role: 'PRODUCER' }, secretKey!, { expiresIn: '1h' });
        res.status(201).json({ message: "Producer Account created successfully", token: token });
    }
}

export const producerLogin = async (req: AuthenticationRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const producer: (IProducer| null) = await Producer.findOne({ username });
    if (!producer) {
        console.log("less go");
        res.status(404).json({ message: "Incorrect Credentials, Not found" });
        return;
    }
    console.log("Wait what??")
    const isPasswordValid: boolean = await bcrypt.compare(password, producer.password);
    if (isPasswordValid) {
        const token: string = jwt.sign({ userId: producer.id, username, role: producer.role }, secretKey!, { expiresIn: '1h' });
        res.json({ role: producer.role, token });
    } 
    else {
        res.json({ message: "Incorrect Credentials" });
    }
}