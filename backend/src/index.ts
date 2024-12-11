import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';

const app: Application = express();
const PORT = process.env.PORT || 3000;

require('./config/db');

const corsOptions: CorsOptions = {
    origin: "http://localhost:5173"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
const freelancerRoutes = require('./routes/freelancerRoute')
const producerRoutes = require('./routes/producerRoute');
const authRoutes = require('./routes/authRoute');
const connectionRoutes = require('./routes/connectionRoute');
const channeliRoutes = require('./routes/channeliRoute')

app.use('', authRoutes);
app.use('', connectionRoutes);
app.use('', channeliRoutes);
app.use('/freelancer', freelancerRoutes);
app.use('/producer', producerRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});