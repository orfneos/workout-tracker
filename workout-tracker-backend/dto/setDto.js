exports.toDto = (set) => {
  if (!set) return null;
  return {
    weight: set.weight,
    reps: set.reps,
  };
}; 