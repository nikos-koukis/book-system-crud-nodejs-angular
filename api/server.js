const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard'); // Import dashboard routes
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml'); // Load the YAML file

const app = express();
const PORT = process.env.PORT || 80;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('API is running');
});

// Define authentication routes
app.use('/auth', authRoutes);

// Define dashboard route
app.use('/dashboard', dashboardRoutes); // Register dashboard route

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});