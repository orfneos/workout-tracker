const Workout = require('../models/workout');

exports.createWorkout = (data) => {
  return Workout.create({
    user: data.user,
    date: data.date || Date.now(),
    exercises: data.exercises,
  });
};

exports.getWorkoutsByUser = (userId) => {
  return Workout.find({ user: userId }).sort({ date: -1 });
};

exports.updateWorkout = (userId, id, exercises, date) => {
  return Workout.findOneAndUpdate(
    { _id: id, user: userId },
    { exercises, date },
    { new: true }
  );
};

exports.deleteWorkout = (userId, id) => {
  return Workout.findOneAndDelete({ _id: id, user: userId });
}; 