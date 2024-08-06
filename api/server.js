const express = require('express');
const cors = require('cors'); // Import the CORS package
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const customerRoutes = require('./routes/customers'); // Import the customer routes
const bookRoutes = require('./routes/books'); // Import the book routes
const orderRoutes = require('./routes/order'); // Import the order routes
const statisticsRoutes = require('./routes/statistics'); // Import the statistics routes
const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./swagger.yaml');
const path = require('path'); // Import path module for serving static files

const app = express();
const PORT = process.env.PORT || 80;

// // Connect to MongoDB
connectDB();

const allowedOrigins = [
    'http://localhost:4200', // Development Origin
    'https://nodejs-angular-beryl.vercel.app' // Production Origin
];

//Use CORS with specific origins
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// // Middleware to parse JSON request bodies
app.use(express.json());

app.use('/assets/uploads', express.static(path.join(__dirname, 'assets', 'uploads')));

// // Swagger UI setup
 //app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route
app.get('/', (req, res) => {
    res.send('API is running');
});

// Define authentication routes
 app.use('/api/auth', authRoutes);


app.use('/api/dashboard', dashboardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/statistics', statisticsRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
