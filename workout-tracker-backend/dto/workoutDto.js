exports.toDto = (workout) => {
  if (!workout) return null;
  return {
    _id: workout._id,
    user: workout.user,
    date: workout.date,
    exercises: workout.exercises,
  };
}; 