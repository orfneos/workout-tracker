const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const workoutController = require('./controllers/workoutController');
const authController = require('./controllers/authController');
require('./db');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Swagger/OpenAPI documentation configuration
 * Auto-generates API docs from JSDoc comments in controllers
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workout Tracker API',
      version: '1.0.0',
      description: 'API documentation for Workout Tracker Backend',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', authController.login);

app.post('/signup', authController.signup);

/**
 * JWT authentication middleware
 * Verifies Bearer token and adds user data to req.user
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.user = user;
    next();
  });
}

app.post('/workout/save', authenticateToken, workoutController.saveWorkout);

app.get('/workouts', authenticateToken, workoutController.getWorkouts);

app.put('/workout/:id', authenticateToken, workoutController.updateWorkout);

app.delete('/workout/:id', authenticateToken, workoutController.deleteWorkout);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});