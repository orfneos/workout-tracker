import { useState, ChangeEvent, FormEvent } from 'react';
import { authAPI } from '../api';
import { Workout, Exercise, WorkoutSet } from '../types/Workouts';
import Input from './Input';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
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
   * Handles immutable updates for a deeply nested state
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
      onSave(result.data);
    } else {
      toast.error(result.error || 'Failed to update workout');
    }
  };

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

              <Button type="button" variant="primary" onClick={addSet}>
                Add Set
              </Button>
            </div>

            <ul className="list-none pl-0">
              {exercise.sets.map((s, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    Set {idx + 1}: {s.weight}kg x {s.reps} reps
                  </li>
              ))}
            </ul>
          </div>

          <Button
              type="submit"
              variant="primary"
              disabled={!exercise.name || exercise.sets.length === 0}
          >
            Add Exercise
          </Button>
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
                            className="mx-1 text-sm w-14"
                        />
                        kg x

                        <Input
                            name={`reps-${exIdx}-${setIdx}`}
                            type="number"
                            min="1"
                            value={String(s.reps)}
                            onChange={e => handleSetEdit(exIdx, setIdx, 'reps', e.target.value)}
                            className="mx-1 text-sm w-14"
                        />
                        reps

                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeSet(exIdx, setIdx)}
                            className="ml-2"
                        >
                          Remove Set
                        </Button>
                      </li>
                  ))}
                </ul>

                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeExercise(exIdx)}
                    className="mt-1"
                >
                  Remove Exercise
                </Button>
              </li>
          ))}
        </ul>

        <div className="flex gap-4">
          <Button
              variant="primary"
              size="lg"
              onClick={handleSave}
              disabled={exercises.length === 0 || loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
          </Button>

          <Button
              variant="secondary"
              size="lg"
              onClick={onCancel}
              disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
  );
};

export default EditWorkoutForm;