const express = require('express')
const cors = require('cors');;

const app = express();
const PORT = process.env.PORT || 3000;

require('./config/db');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
const freelancerRoutes = require('./src/routes/freelancerRoute')
const producerRoutes = require('./src/routes/producerRoute');
const authRoutes = require('./src/routes/authRoute');
const connectionRoutes = require('./src/routes/connectionRoute');
const channeliRoutes = require('./src/routes/channeliRoute')

app.use('', authRoutes);
app.use('', connectionRoutes);
app.use('', channeliRoutes);
app.use('/freelancer', freelancerRoutes);
app.use('/producer', producerRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});