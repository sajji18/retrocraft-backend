import path from 'path';
import dotenv from 'dotenv';

const envPath: string = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const secretKey: (string | undefined) = process.env.JWT_SECRET;

if (!secretKey) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

export default secretKey;