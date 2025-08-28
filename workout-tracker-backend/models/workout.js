const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: [setSchema],
});

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  exercises: [exerciseSchema],
});

module.exports = mongoose.model('Workout', workoutSchema); 