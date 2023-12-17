const { Freelancer } = require('../../models/freelancer')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;

const freelancerDetails = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, secretKey, { complete: true }); 
    const freelancer = await Freelancer.findOne({ username: decoded.payload.username });
    if (!freelancer) {
        res.status(401).json({ message: "Unauthorized" });
    }
    else {
        res.json({ user: decoded });
    }
}

module.exports = {
    freelancerDetails
}