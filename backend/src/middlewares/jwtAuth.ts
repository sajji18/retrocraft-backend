import { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import { verify, VerifyErrors } from "jsonwebtoken";

const envPath: string = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey: (string | undefined) = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

interface AuthenticationRequest extends Request {
    user?: Object;
}

const jwtAuthentication = (
    req: AuthenticationRequest, 
    res: Response, 
    next: NextFunction
): void => {
    const authorizationHeader: (string | undefined) = req.header('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    const token: string = authorizationHeader.split(' ')[1];
    try{
        verify(token, secretKey, (err: VerifyErrors | null, user: Object | undefined) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            } else {
                req.user = user;
                // console.log(user)
                next();
            }
        });
    }
    catch{
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export default jwtAuthentication;