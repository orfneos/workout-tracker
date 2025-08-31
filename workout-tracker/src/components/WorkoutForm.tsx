import { useState, ChangeEvent, FormEvent } from 'react';
import { Exercise, WorkoutSet } from '../types/Workouts';
import Button from './Button';
import Input from './Input';
import toast from 'react-hot-toast';

interface WorkoutFormProps {
    exercises: Exercise[];
    onExercisesChange: (exercises: Exercise[]) => void;
    onSave: () => void;
    onCancel: () => void;
    loading: boolean;
    error: string;
    saveButtonText: string;
}

interface SetForm {
    weight: string;
    reps: string;
}

const WorkoutForm = ({
                         exercises,
                         onExercisesChange,
                         onSave,
                         onCancel,
                         loading,
                         error,
                         saveButtonText
                     }: WorkoutFormProps) => {
    const [exerciseName, setExerciseName] = useState('');
    const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
    const [currentSet, setCurrentSet] = useState<SetForm>({ weight: '', reps: '' });

    const handleExerciseNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setExerciseName(e.target.value);
    };

    const handleSetChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentSet({ ...currentSet, [name]: value });
    };

    const addSet = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentSet.weight || !currentSet.reps) {
            toast.error('Please enter both weight and reps');
            return;
        }

        const weight = parseFloat(currentSet.weight);
        const reps = parseInt(currentSet.reps);

        if (weight <= 0) {
            toast.error('Weight must be greater than 0');
            return;
        }

        if (reps <= 0) {
            toast.error('Reps must be greater than 0');
            return;
        }

        const newSet: WorkoutSet = { weight, reps };
        setCurrentSets([...currentSets, newSet]);
        setCurrentSet({ weight: '', reps: '' });
    };

    const addExercise = (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!exerciseName) {
            toast.error('Please enter exercise name');
            return;
        }

        if (currentSets.length === 0) {
            toast.error('Please add at least one set');
            return;
        }

        const newExercise: Exercise = {
            name: exerciseName,
            sets: currentSets
        };

        onExercisesChange([...exercises, newExercise]);
        setExerciseName('');
        setCurrentSets([]);
        setCurrentSet({ weight: '', reps: '' });
        toast.success('Exercise added successfully!');
    };

    const removeExercise = (index: number) => {
        const newExercises = exercises.filter((_, i) => i !== index);
        onExercisesChange(newExercises);
    };

    return (
        <div className="max-w-lg mx-auto my-8 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Create New Workout</h2>

            {/* Exercise Name Input */}
            <form className="flex gap-2 mb-4 w-full" onSubmit={addExercise}>
                <Input
                    name="exercise-name"
                    value={exerciseName}
                    onChange={handleExerciseNameChange}
                    placeholder="Exercise Name"
                    required
                    className="flex-1 h-11"
                />
            </form>

            {/* Sets Form */}
            <form className="flex gap-2 mb-4 w-full flex-wrap" onSubmit={addSet} noValidate>
                <div className="flex gap-2 flex-1">
                    <Input
                        name="weight"
                        value={currentSet.weight}
                        onChange={handleSetChange}
                        placeholder="Weight"
                        type="number"
                        min="0.1"
                        className="w-24"
                    />
                    <Input
                        name="reps"
                        value={currentSet.reps}
                        onChange={handleSetChange}
                        placeholder="Reps"
                        type="number"
                        min="1"
                        className="w-20"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="px-4 py-2"
                    >
                        Add Set
                    </Button>
                </div>
            </form>

            {/* Current Sets List */}
            {currentSets.length > 0 && (
                <div className="w-full mb-4">
                    <h3 className="font-medium mb-2">Current Sets:</h3>
                    <ul className="list-none pl-0 bg-gray-50 p-3 rounded-md">
                        {currentSets.map((s, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                                Set {idx + 1}: {s.weight}kg x {s.reps} reps
                            </li>
                        ))}
                    </ul>

                    {/* Add Exercise Button */}
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            addExercise(e);
                        }}
                        disabled={!exerciseName}
                        variant="primary"
                        className="w-full mt-3"
                    >
                        Add Exercise
                    </Button>
                </div>
            )}

            {/* Added Exercises List */}
            {exercises.length > 0 && (
                <div className="w-full mb-6">
                    <h3 className="font-medium mb-2">Added Exercises:</h3>
                    <ul className="list-none p-0">
                        {exercises.map((ex, idx) => (
                            <li key={idx} className="bg-gray-100 mb-2 p-4 rounded-md text-left">
                                <strong className="block mb-2">{ex.name}</strong>
                                <ul className="list-none pl-4">
                                    {ex.sets.map((s, sidx) => (
                                        <li key={sidx} className="text-sm text-gray-600">
                                            Set {sidx + 1}: {s.weight}kg x {s.reps} reps
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeExercise(idx)}
                                    className="mt-2"
                                >
                                    Remove Exercise
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <div className="text-red-500 mb-4 w-full text-center">{error}</div>}

            <div className="flex gap-4">
                <Button
                    onClick={onSave}
                    disabled={exercises.length === 0 || loading}
                    variant="primary"
                    size="lg"
                    loading={loading}
                >
                    {saveButtonText}
                </Button>
                <Button
                    onClick={onCancel}
                    disabled={loading}
                    variant="secondary"
                    size="lg"
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
};

export default WorkoutForm;