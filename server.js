const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
connectDB = require('./src/config/db'); // Import the database connection
const morgan = require('morgan');
const dotenv = require('dotenv'); // Import dotenv for environment variables
const cors = require('cors'); // Import cors for Cross-Origin Resource Sharing
const fs = require('fs');
const path = require('path');
require('./src/services/CronJobs'); 
app.use(cookieParser());

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173', // frontend origin (not '*')
  credentials: true,               // allow cookies
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));




dotenv.config(); // Load environment variables from .env file
connectDB(); // Connect to the database

// Basic route to check if the server is working

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'), { flags: 'a' }
);


app.use(morgan('combined', { stream: accessLogStream }));







app.use('/api/users', require('./src/routes/Usersroutes') ); // Use user routes
app.use('/api/doctors', require('./src/routes/Doctorroutes'));
app.use("/api/appointments", require('./src/routes/Appointmentsroutes'));
app.use("/api/reschedule", require('./src/routes/reschedulRequestsroutes'));
app.use('/api/notifications', require('./src/routes/notificationroutes'));




// Server listening on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});

