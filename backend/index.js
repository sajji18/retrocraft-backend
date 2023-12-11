const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
const authRoutes = require('./src/routes/authRoute')

app.use('/', authRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});