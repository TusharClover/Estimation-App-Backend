const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const pool = require('./app/config/db');

// Use CORS middleware
app.use(cors({
    origin: true, // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

app.use(bodyParser.json());

// Handle preflight OPTIONS request
app.options('*', cors());

// Middleware
app.use(express.json());

app.use('/api/users', require('./app/routes/userRoutes'));

app.use('/api/clients', require('./app/routes/clientsRoutes'));

app.use('/api/profiles', require('./app/routes/profilesRoutes'));

app.use('/api/estimations', require('./app/routes/estimationRoutes'));

app.use('/api/devefforts', require('./app/routes/devEffortsRoutes'));

app.use('/api/phases', require('./app/routes/phasesRoutes'));

app.use('/api/proposedschedule', require('./app/routes/proposedScheduleRoutes'));

app.use('/api/rateCard', require('./app/routes/rateCardRoutes'));

app.use('/api/sites', require('./app/routes/sitesRoutes'));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});

pool.query('SELECT * FROM users')
    .then(() => {
        console.log('Connected to MySQL');
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err);
    });