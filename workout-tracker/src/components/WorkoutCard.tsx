import { Workout } from '../types/Workouts';
import EditWorkoutForm from './EditWorkoutForm';
import Button from './Button';

interface WorkoutCardProps {
    workout: Workout;
    editingId: string | null;
    onEdit: (id: string) => void;
    onEditSave: (workout: Workout) => void;
    onEditCancel: () => void;
    onDelete: (id: string) => void;
}

const WorkoutCard = ({
                         workout,
                         editingId,
                         onEdit,
                         onEditSave,
                         onEditCancel,
                         onDelete
                     }: WorkoutCardProps) => {
    // Handles both MongoDB (_id) and generic (id) identifier formats
    const workoutId = workout._id || workout.id;
    const isEditing = editingId === workoutId;

    return (
        <li className="bg-gray-100 mb-2 p-4 rounded-md text-left">
            <div className="flex justify-between items-center mb-2">
                <strong className="text-lg">{new Date(workout.date || Date.now()).toLocaleString()}</strong>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(workoutId)}
                    className="ml-4"
                >
                    Delete
                </Button>
            </div>

            {isEditing ? (
                <EditWorkoutForm
                    workout={workout}
                    onSave={onEditSave}
                    onCancel={onEditCancel}
                />
            ) : (
                <>
                    <ul className="list-none pl-0 mt-2">
                        {workout.exercises.map((ex, idx) => (
                            <li key={idx} className="mb-3">
                                <span className="font-semibold block mb-1">{ex.name}</span>
                                <ul className="list-none pl-6 mt-1 text-gray-600 text-sm">
                                    {ex.sets.map((s, sidx) => (
                                        <li key={sidx} className="mb-1">
                                            Set {sidx + 1}: {s.weight}kg x {s.reps} reps
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    <Button
                        variant="primary"
                        onClick={() => onEdit(workoutId)}
                        className="mt-3"
                    >
                        Edit
                    </Button>
                </>
            )}
        </li>
    );
};

export default WorkoutCard;