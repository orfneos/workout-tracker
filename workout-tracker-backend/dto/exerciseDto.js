exports.toDto = (exercise) => {
  if (!exercise) return null;
  return {
    name: exercise.name,
    sets: exercise.sets,
  };
}; 