const { Freelancer } = require('../../models/freelancer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;

const freelancerSignup = async (req, res) => {
    const { username, password, email } = req.body;
    const freelancer = await Freelancer.findOne({ $or: [{ username }, { email }] });
        console.log(req.body);
        if (freelancer) {
            // console.log("I reached here")
            res.status(400).json({ message: "Username Or Email already in use" });
        }
        else {
            const hashPassword = await bcrypt.hash(password, 10);
            const newFreelancer = new Freelancer({
                username,
                password: hashPassword,
                email,
            });
            await newFreelancer.save();
            const token = jwt.sign({ freelancerId: newFreelancer.id, username, role: 'FREELANCER' }, secretKey, { expiresIn: '1h' });
            res.status(201).json({ message: "User Account created successfully", role: 'FREELANCER', token: token });
        }
}

const freelancerLogin = async (req, res) => {
    const { username, password } = req.body;
    const freelancer = await Freelancer.findOne({ username });
    if (!freelancer) {
        res.status(404).json({ message: "Incorrect Credentials" });
    }
    else {
        const isPasswordValid = await bcrypt.compare(password, freelancer.password);
        if (isPasswordValid) {
            // console.log(secretKey);
            const token = jwt.sign({ username, role: freelancer.role }, secretKey, { expiresIn: '1h' });
            res.json({ message: 'Authenticated Freelancer', token });
        }
    }
}

module.exports = {
    freelancerSignup,
    freelancerLogin
}