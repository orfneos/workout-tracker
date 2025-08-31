import { useState, ChangeEvent, FormEvent } from 'react';
import { authAPI } from '../api';
import { Workout, Exercise, WorkoutSet } from '../types/Workouts';
import { cn } from '../lib/utils';
import Input from './Input';
import toast from 'react-hot-toast';

interface EditWorkoutFormProps {
  workout: Workout;
  onSave: (workout: Workout) => void;
  onCancel: () => void;
}

interface ExerciseForm {
  name: string;
  sets: WorkoutSet[];
}

interface SetForm {
  weight: string;
  reps: string;
}

const EditWorkoutForm = ({ workout, onSave, onCancel }: EditWorkoutFormProps) => {
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises.map(ex => ({
    name: ex.name,
    sets: ex.sets.map(s => ({ weight: s.weight, reps: s.reps }))
  })));
  const [exercise, setExercise] = useState<ExerciseForm>({ name: '', sets: [] });
  const [set, setSet] = useState<SetForm>({ weight: '', reps: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleExerciseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExercise({ ...exercise, name: e.target.value });
  };

  const handleSetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSet({ ...set, [name]: value });
  };

  const addSet = (e: FormEvent) => {
    e.preventDefault();

    if (!set.weight || !set.reps) {
      toast.error('Please enter both weight and reps');
      return;
    }

    const weight = parseFloat(set.weight);
    const reps = parseInt(set.reps);

    if (weight <= 0) {
      toast.error('Weight must be greater than 0');
      return;
    }

    if (reps <= 0) {
      toast.error('Reps must be greater than 0');
      return;
    }

    const newSet: WorkoutSet = { weight, reps };
    setExercise({ ...exercise, sets: [...exercise.sets, newSet] });
    setSet({ weight: '', reps: '' });
  };

  const addExercise = (e: FormEvent) => {
    e.preventDefault();

    if (!exercise.name) {
      toast.error('Please enter exercise name');
      return;
    }

    if (exercise.sets.length === 0) {
      toast.error('Please add at least one set');
      return;
    }

    const newExercise: Exercise = {
      name: exercise.name,
      sets: exercise.sets
    };
    setExercises([...exercises, newExercise]);
    setExercise({ name: '', sets: [] });
    toast.success('Exercise added successfully!');
  };

  const removeExercise = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleExerciseNameEdit = (idx: number, value: string) => {
    setExercises(exercises.map((ex, i) => i === idx ? { ...ex, name: value } : ex));
  };

  /**
   * Updates a specific set field within a nested exercise structure
   * Handles immutable updates for deeply nested state
   */
  const handleSetEdit = (exIdx: number, setIdx: number, field: keyof WorkoutSet, value: string) => {
    setExercises(exercises.map((ex, i) =>
        i === exIdx
            ? { ...ex, sets: ex.sets.map((s, j) => j === setIdx ? { ...s, [field]: parseFloat(value) } : s) }
            : ex
    ));
  };

  const removeSet = (exIdx: number, setIdx: number) => {
    setExercises(exercises.map((ex, i) =>
        i === exIdx
            ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) }
            : ex
    ));
  };

  /**
   * Handles workout update with fallback ID resolution
   * Supports both MongoDB (_id) and generic (id) identifier formats
   */
  const handleSave = async (): Promise<void> => {
    setLoading(true);
    setError('');
    const workoutId = workout._id || workout.id;
    if (!workoutId) {
      toast.error('Workout ID is missing');
      setLoading(false);
      return;
    }
    const result = await authAPI.updateWorkout(workoutId, { ...workout, exercises });
    setLoading(false);
    if (result.success) {
      toast.success('Workout updated successfully!');
      if (onSave) onSave(result.data);
    } else {
      toast.error(result.error || 'Failed to update workout');
    }
  };

  const buttonBaseClasses = 'rounded-md border-none cursor-pointer font-medium transition-colors duration-200';
  const primaryButtonClasses = 'bg-blue-500 text-white hover:bg-blue-600';
  const dangerButtonClasses = 'bg-red-500 text-white hover:bg-red-700';
  const disabledButtonClasses = 'bg-gray-300 cursor-not-allowed';

  return (
      <div className="bg-gray-100 rounded-lg p-4 my-4">
        <form className="flex flex-col gap-4 mb-4" onSubmit={addExercise} noValidate>
          <Input
              name="name"
              value={exercise.name}
              onChange={handleExerciseNameChange}
              placeholder="Exercise Name"
              className="w-40"
          />

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                  name="weight"
                  value={set.weight}
                  onChange={handleSetChange}
                  placeholder="Weight"
                  type="number"
                  min="0"
                  className="w-24"
              />

              <Input
                  name="reps"
                  value={set.reps}
                  onChange={handleSetChange}
                  placeholder="Reps"
                  type="number"
                  min="1"
                  className="w-20"
              />

              <button
                  onClick={addSet}
                  className={cn(buttonBaseClasses, primaryButtonClasses, 'px-4 py-2')}
                  type="button"
              >
                Add Set
              </button>
            </div>

            <ul className="list-none pl-0">
              {exercise.sets.map((s, idx) => (
                  <li key={idx} className="text-sm text-gray-600">Set {idx + 1}: {s.weight}kg x {s.reps} reps</li>
              ))}
            </ul>
          </div>

          <button
              type="submit"
              disabled={!exercise.name || exercise.sets.length === 0}
              className={cn(
                  buttonBaseClasses,
                  primaryButtonClasses,
                  'px-4 py-2',
                  (!exercise.name || exercise.sets.length === 0) && disabledButtonClasses
              )}
          >
            Add Exercise
          </button>
        </form>

        <ul className="list-none p-0 mb-4 w-full">
          {exercises.map((ex, exIdx) => (
              <li key={exIdx} className="bg-white mb-2 p-4 rounded-md text-left">
                <Input
                    name={`exercise-name-${exIdx}`}
                    value={ex.name}
                    onChange={e => handleExerciseNameEdit(exIdx, e.target.value)}
                    placeholder="Exercise Name"
                    className="font-semibold text-base mb-2 mr-2"
                />

                <ul className="list-none pl-4">
                  {ex.sets.map((s, setIdx) => (
                      <li key={setIdx} className="mb-2">
                        Set {setIdx + 1}:

                        <Input
                            name={`weight-${exIdx}-${setIdx}`}
                            type="number"
                            min="0"
                            value={String(s.weight)}
                            onChange={e => handleSetEdit(exIdx, setIdx, 'weight', e.target.value)}
                            className="mx-1 text-sm"
                            style={{ width: 60 }}
                        />
                        kg x

                        <Input
                            name={`reps-${exIdx}-${setIdx}`}
                            type="number"
                            min="1"
                            value={String(s.reps)}
                            onChange={e => handleSetEdit(exIdx, setIdx, 'reps', e.target.value)}
                            className="mx-1 text-sm"
                            style={{ width: 50 }}
                        />
                        reps

                        <button
                            className={cn(buttonBaseClasses, dangerButtonClasses, 'ml-4 px-4 py-1 text-sm')}
                            onClick={() => removeSet(exIdx, setIdx)}
                            type="button"
                        >
                          Remove Set
                        </button>
                      </li>
                  ))}
                </ul>

                <button
                    className={cn(buttonBaseClasses, dangerButtonClasses, 'mt-2 px-4 py-1 text-sm')}
                    onClick={() => removeExercise(exIdx)}
                    type="button"
                >
                  Remove Exercise
                </button>
              </li>
          ))}
        </ul>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex gap-4">
          <button
              onClick={handleSave}
              disabled={exercises.length === 0 || loading}
              className={cn(
                  buttonBaseClasses,
                  primaryButtonClasses,
                  'px-6 py-3 text-base font-medium',
                  (exercises.length === 0 || loading) && disabledButtonClasses
              )}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button
              onClick={onCancel}
              disabled={loading}
              className={cn(
                  buttonBaseClasses,
                  'px-6 py-3 text-base font-medium bg-gray-200 text-gray-800 hover:bg-red-500 hover:text-white',
                  loading && disabledButtonClasses
              )}
          >
            Cancel
          </button>
        </div>
      </div>
  );
};

export default EditWorkoutForm;