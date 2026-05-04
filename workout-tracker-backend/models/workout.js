const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  weight: { type: Number, required: true, min: 0 },
  reps: { type: Number, required: true, min: 1 },
});

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: [setSchema], default: [] },  
});

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  exercises: { type: [exerciseSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema); 