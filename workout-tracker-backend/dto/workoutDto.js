exports.toDto = (workout) => {
  if (!workout) return null;
  return {
    _id: workout._id,
    date: workout.date,
    exercises: workout.exercises,
  };
}; 