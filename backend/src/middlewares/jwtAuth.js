const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey = process.env.JWT_SECRET_KEY;

const jwtAuthentication = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) {
        res.json({ message: "Unauthorized" });
    }
    else{
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                throw err;
            }
            else{
                req.user = user;
                next();
            }
        })
    }
}

module.exports = {
    jwtAuthentication
}