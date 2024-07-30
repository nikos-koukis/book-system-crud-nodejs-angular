const express = require('express');
const cors = require('cors'); // Import the CORS package
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const PORT = process.env.PORT || 80;

// Connect to MongoDB
connectDB();

// Use CORS with specific origins
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from Angular frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    credentials: true // Enable cookies, authorization headers, and TLS client certificates
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Swagger UI setup
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
    res.send('API is running');
});

// Define authentication routes
app.use('/api/auth', authRoutes);

// Define dashboard route
app.use('/api/dashboard', dashboardRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
