const workoutService = require('../services/workoutService');

/**
 * Validation utilities for workout endpoints
 */
const validateExerciseName = (name) => {
  return typeof name === 'string' && name.trim().length > 0 && name.trim().length <= 100;
};

const validateSet = (set) => {
  if (!set || typeof set !== 'object') return false;

  const { weight, reps } = set;
  return (
      typeof weight === 'number' &&
      typeof reps === 'number' &&
      weight > 0 &&
      reps > 0 &&
      weight <= 1000 &&
      reps <= 100
  );
};

const validateExercise = (exercise) => {
  if (!exercise || typeof exercise !== 'object') return { isValid: false, message: 'Exercise must be an object' };

  const { name, sets } = exercise;

  if (!validateExerciseName(name)) {
    return { isValid: false, message: 'Exercise name must be a non-empty string (max 100 characters)' };
  }

  if (!Array.isArray(sets) || sets.length === 0) {
    return { isValid: false, message: 'Exercise must have at least one set' };
  }

  if (sets.length > 20) {
    return { isValid: false, message: 'Exercise cannot have more than 20 sets' };
  }

  for (let i = 0; i < sets.length; i++) {
    if (!validateSet(sets[i])) {
      return { isValid: false, message: `Invalid set at position ${i + 1}. Weight and reps must be positive numbers (weight ≤ 1000, reps ≤ 100)` };
    }
  }

  return { isValid: true };
};

const validateWorkoutId = (id) => {
  return typeof id === 'string' && id.trim().length > 0;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Exercise:
 *       type: object
 *       required:
 *         - name
 *         - sets
 *         - reps
 *         - weight
 *       properties:
 *         name:
 *           type: string
 *           example: "Bench Press"
 *         sets:
 *           type: number
 *           example: 3
 *         reps:
 *           type: number
 *           example: 10
 *         weight:
 *           type: number
 *           example: 70
 *     Workout:
 *       type: object
 *       required:
 *         - exercises
 *       properties:
 *         exercises:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Exercise'
 *         date:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 */

/**
 * @swagger
 * /workout/save:
 *   post:
 *     summary: Save a new workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exercises
 *             properties:
 *               exercises:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Exercise'
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *     responses:
 *       201:
 *         description: Workout saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Workout saved!"
 *                 workout:
 *                   $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
exports.saveWorkout = async (req, res) => {
  try {
    // Request body validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    const { exercises, date } = req.body;
    const userId = req.user.userId;

    // User ID validation (from JWT middleware)
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Exercises validation
    if (!exercises) {
      return res.status(400).json({ message: 'Exercises are required' });
    }

    if (!Array.isArray(exercises)) {
      return res.status(400).json({ message: 'Exercises must be an array' });
    }

    if (exercises.length === 0) {
      return res.status(400).json({ message: 'At least one exercise is required' });
    }

    if (exercises.length > 50) {
      return res.status(400).json({ message: 'Maximum 50 exercises allowed per workout' });
    }

    // Validate each exercise
    for (let i = 0; i < exercises.length; i++) {
      const exerciseValidation = validateExercise(exercises[i]);
      if (!exerciseValidation.isValid) {
        return res.status(400).json({
          message: `Exercise ${i + 1}: ${exerciseValidation.message}`
        });
      }
    }

    // Date validation (optional)
    if (date && !Date.parse(date)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const workout = await workoutService.saveWorkout(userId, exercises, date);
    res.status(201).json({ message: 'Workout saved!', workout });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Get all workouts for the authenticated user
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workouts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 workouts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
exports.getWorkouts = async (req, res) => {
  try {
    const userId = req.user.userId;

    // User ID validation (from JWT middleware)
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    const workouts = await workoutService.getWorkouts(userId);
    res.status(200).json({ workouts });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

/**
 * @swagger
 * /workout/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exercises:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Exercise'
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Workout updated!"
 *                 workout:
 *                   $ref: '#/components/schemas/Workout'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */
exports.updateWorkout = async (req, res) => {
  try {
    // Request body validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    const userId = req.user.userId;
    const { id } = req.params;
    const { exercises, date } = req.body;

    // User ID validation
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Workout ID validation
    if (!validateWorkoutId(id)) {
      return res.status(400).json({ message: 'Invalid workout ID' });
    }

    // Exercises validation (if provided)
    if (exercises !== undefined) {
      if (!Array.isArray(exercises)) {
        return res.status(400).json({ message: 'Exercises must be an array' });
      }

      if (exercises.length === 0) {
        return res.status(400).json({ message: 'At least one exercise is required' });
      }

      if (exercises.length > 50) {
        return res.status(400).json({ message: 'Maximum 50 exercises allowed per workout' });
      }

      // Validate each exercise
      for (let i = 0; i < exercises.length; i++) {
        const exerciseValidation = validateExercise(exercises[i]);
        if (!exerciseValidation.isValid) {
          return res.status(400).json({
            message: `Exercise ${i + 1}: ${exerciseValidation.message}`
          });
        }
      }
    }

    // Date validation (optional)
    if (date && !Date.parse(date)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    const workout = await workoutService.updateWorkout(userId, id, exercises, date);
    res.status(200).json({ message: 'Workout updated!', workout });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

/**
 * @swagger
 * /workout/{id}:
 *   delete:
 *     summary: Delete a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The workout ID
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Workout deleted!"
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 *       500:
 *         description: Internal server error
 */
exports.deleteWorkout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    // User ID validation
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Workout ID validation
    if (!validateWorkoutId(id)) {
      return res.status(400).json({ message: 'Invalid workout ID' });
    }

    await workoutService.deleteWorkout(userId, id);
    res.status(200).json({ message: 'Workout deleted!' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};