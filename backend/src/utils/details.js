const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');
// const { use } = require('../routes/authRoute');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET;
const details = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, secretKey, { complete: true }); 
        res.json({ user: decoded })    
    }
    catch (error) {
        res.status(400).json({ message: "Error decoding the token" });
    }
}

module.exports = {
    details
}