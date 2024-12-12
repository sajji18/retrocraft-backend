import mongoose, { Connection } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_URI, NODE_ENV } = process.env;

// Set up Mongoose connection
mongoose.connect(MONGODB_URI as string, {
    dbName: 'RetrocraftHub',
});

const db: Connection = mongoose.connection;

// Event listeners for Mongoose connection
db.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

process.on('SIGINT', async () => {
    try {
        await db.close();
        console.log('MongoDB connection closed due to process termination');
        process.exit(0);
    } catch (err) {
        console.error(`Error closing MongoDB connection: ${err}`);
        process.exit(1);
    }
});

export default db;
