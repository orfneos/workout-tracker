# Workout Tracker

A full-stack web application for tracking workouts, exercises, and sets. Built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## Features

- User authentication (signup/login) with JWT tokens
- Create, read, update, and delete workouts
- Add multiple exercises per workout
- Track sets with weight and repetitions
- Edit existing workouts and exercises
- Responsive design with Tailwind CSS
- RESTful API with Swagger documentation

## Tech Stack

### Frontend
- React 19.1.0
- TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router DOM
- Axios (HTTP client)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT authentication
- bcrypt (password hashing)
- Swagger (API documentation)

## Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js**: v22.13.1 or higher
- **MongoDB**: Running locally on default port 27017
- **npm**: Comes with Node.js

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd workout-tracker-staging
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd workout-tracker-backend

# Install dependencies
npm install

# Start MongoDB service (if not already running)
# On Windows: net start MongoDB
# On macOS: brew services start mongodb/brew/mongodb-community
# On Linux: sudo systemctl start mongod

# Start the backend server
npm run dev
```

The backend server will start on http://localhost:3000

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd workout-tracker

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will start on http://localhost:5173

## Environment Variables

The application uses the following environment variables (with defaults):

### Backend (.env file - optional)
```env
JWT_SECRET=supersecretkey
MONGODB_URI=mongodb://127.0.0.1:27017/mydb
PORT=3000
```

If no `.env` file is provided, the application will use the default values shown above.

## Usage

### 1. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

### 2. Getting Started
1. Open the frontend application in your browser
2. Create a new account using the signup form
3. Login with your credentials
4. Start creating workouts by adding exercises and sets
5. View your workout history and edit existing workouts

### 3. API Endpoints

The backend provides the following REST API endpoints:

- `POST /signup` - User registration
- `POST /login` - User authentication
- `GET /workouts` - Get all user workouts
- `POST /workout/save` - Create a new workout
- `PUT /workout/:id` - Update an existing workout
- `DELETE /workout/:id` - Delete a workout

All workout-related endpoints require JWT authentication via Bearer token.

## Database Structure

### MongoDB Collections

**users**
```javascript
<!--{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String
}-->
```

**workouts**
```javascript
<!-- {
  _id: ObjectId,
  user: ObjectId (ref: User),
  date: Date,
  exercises: [{
    name: String,
    sets: [{
      weight: Number,
      reps: Number
    }]
  }]
}-->
```

## Architecture

The application follows a layered architecture pattern:

### Backend Layers
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and validation
- **DAOs**: Data access operations
- **DTOs**: Data transfer objects for API responses
- **Models**: Mongoose schemas and database models
- **Middleware**: Authentication and request processing

### Frontend Structure
- **Pages**: Main application views (Login, Profile, Workouts, CreateWorkout)
- **Components**: Reusable UI components
- **API**: HTTP client configuration and API calls
- **Types**: TypeScript type definitions

## Build for Production

### Backend
```bash
cd workout-tracker-backend
npm start
```

### Frontend
```bash
cd workout-tracker
npm run build
npm run preview
```

## API Testing with cURL

Here are example cURL commands to test all API endpoints:

### 1. User Signup
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123"
  }'
```

**Save the JWT token from the response for the next requests.**

### 3. Create a New Workout
```bash
curl -X POST http://localhost:3000/workout/save \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "exercises": [
      {
        "name": "Bench Press",
        "sets": [
          {"weight": 80, "reps": 8},
          {"weight": 85, "reps": 6},
          {"weight": 90, "reps": 4}
        ]
      },
      {
        "name": "Squats",
        "sets": [
          {"weight": 100, "reps": 10},
          {"weight": 110, "reps": 8}
        ]
      }
    ],
    "date": "2025-01-15"
  }'
```

### 4. Get All Workouts
```bash
curl -X GET http://localhost:3000/workouts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 5. Update a Workout
```bash
curl -X PUT http://localhost:3000/workout/WORKOUT_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "exercises": [
      {
        "name": "Updated Exercise",
        "sets": [
          {"weight": 75, "reps": 12}
        ]
      }
    ]
  }'
```

### 6. Delete a Workout
```bash
curl -X DELETE http://localhost:3000/workout/WORKOUT_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Testing Workflow
1. Run the signup command to create a new user
2. Run the login command and copy the JWT token from the response
3. Replace `YOUR_JWT_TOKEN_HERE` in subsequent commands with the actual token
4. Use the create workout command to add test data
5. Use get workouts to retrieve the workout ID
6. Replace `WORKOUT_ID_HERE` with the actual ID for update/delete operations

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
    - Ensure MongoDB is running locally
    - Check that the database name 'mydb' is accessible
    - Verify connection string in the backend code

2. **CORS Issues**
    - The backend is configured to allow requests from the frontend
    - Ensure both servers are running on their respective ports

3. **JWT Token Issues**
    - Tokens expire after 7 days
    - Login again if you receive authentication errors

4. **Build Issues**
    - Ensure all dependencies are installed (`npm install`)
    - Check that Node.js version is compatible (v22.13.1+)

## License

ISC License