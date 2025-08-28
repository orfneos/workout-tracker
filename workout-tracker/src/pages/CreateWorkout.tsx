import { useState } from 'react';
import { authAPI } from '../api';
import { Exercise } from '../types/Workouts';
import WorkoutForm from '../components/WorkoutForm';

interface CreateWorkoutProps {
  onSave: () => void;
  onCancel: () => void;
}

const CreateWorkout = ({ onSave, onCancel }: CreateWorkoutProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (): Promise<void> => {
    if (exercises.length === 0) return;

    setLoading(true);
    setError('');

    try {
      const result = await authAPI.saveWorkout({
        exercises,
        date: new Date()
      });

      if (result.success) {
        onSave?.();
      } else {
        setError(result.error || 'Failed to save workout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
      <WorkoutForm
          exercises={exercises}
          onExercisesChange={setExercises}
          onSave={handleSave}
          onCancel={onCancel}
          loading={loading}
          error={error}
          saveButtonText="Save Workout"
      />
  );
};

export default CreateWorkout;