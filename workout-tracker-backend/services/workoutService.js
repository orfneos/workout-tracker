const workoutDao = require('../dao/workoutDao');
const workoutDto = require('../dto/workoutDto');

exports.saveWorkout = async (userId, exercises, date) => {
  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
    const err = new Error('Exercises are required.');
    err.status = 400;
    throw err;
  }
  const workout = await workoutDao.createWorkout({ user: userId, exercises, date });
  return workoutDto.toDto(workout);
};

exports.getWorkouts = async (userId) => {
  const workouts = await workoutDao.getWorkoutsByUser(userId);
  return workouts.map(workoutDto.toDto);
};

exports.updateWorkout = async (userId, id, exercises, date) => {
  const workout = await workoutDao.updateWorkout(userId, id, exercises, date);
  if (!workout) {
    const err = new Error('Workout not found.');
    err.status = 404;
    throw err;
  }
  return workoutDto.toDto(workout);
};

exports.deleteWorkout = async (userId, id) => {
  const workout = await workoutDao.deleteWorkout(userId, id);
  if (!workout) {
    const err = new Error('Workout not found.');
    err.status = 404;
    throw err;
  }
  return true;
}; 