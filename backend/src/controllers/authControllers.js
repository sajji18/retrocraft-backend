const { User } = require('../models/models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;

const userSignup = async (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email }] });
    console.log(req.body);
    if (user) {
        res.status(400).json({ message: "Username Or Email already in use" });
    }
    else{
        console.log("Control reached here");
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashPassword,
            firstName,
            lastName,
            email
        });
        await newUser.save();
        res.status(201).json({ message: "User Account created successfully" })
    }
}

const userLogin = async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.body);
    const user = await User.findOne({ username });
    // console.log(user);
    if (!user) {
        res.status(404).json({ message: "User not found" });
    }
    else{
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // console.log(secretKey);
            const token = jwt.sign({ username, role: 'User' }, secretKey, { expiresIn: '1h' });
            res.json({ message: 'Authenticated', token });
        } 
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }   
    }
}

module.exports = {
    userSignup,
    userLogin
}