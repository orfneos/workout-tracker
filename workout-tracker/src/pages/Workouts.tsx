import { useEffect, useState } from 'react';
import { authAPI } from '../api';
import { Workout } from '../types/Workouts';
import WorkoutCard from '../components/WorkoutCard';
import toast from "react-hot-toast";

const Workouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async (): Promise<void> => {
      setLoading(true);
      setError('');
      const result = await authAPI.getWorkouts();
      setLoading(false);
      if (result.success) {
        setWorkouts(result.data);
      } else {
        setError(result.error || 'Failed to fetch workouts');
      }
    };
    fetchWorkouts();
  }, []);

  const handleEditSave = (updatedWorkout: Workout): void => {
    setWorkouts(workouts.map(w => {
      const wId = w._id || w.id;
      const updatedId = updatedWorkout._id || updatedWorkout.id;
      return wId === updatedId ? updatedWorkout : w;
    }));
    setEditingId(null);
  };

  const handleDeleteWorkout = async (id: string): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return;
    const result = await authAPI.deleteWorkout(id);
    if (result.success) {
      setWorkouts(workouts.filter(w => {
        const wId = w._id || w.id;
        return wId !== id;
      }));
      toast.success('Workout deleted successfully!');
    } else {
      toast.error(result.error || 'Failed to delete workout');
    }
  };

  return (
      <div className="max-w-lg mx-auto my-8 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6">Your Workouts</h2>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <ul className="list-none p-0 w-full mt-4">
          {workouts.map((workout) => (
              <WorkoutCard
                  key={workout._id || workout.id}
                  workout={workout}
                  editingId={editingId}
                  onEdit={setEditingId}
                  onEditSave={handleEditSave}
                  onEditCancel={() => setEditingId(null)}
                  onDelete={handleDeleteWorkout}
              />
          ))}
        </ul>
        {(!loading && workouts.length === 0) && <div className="text-gray-500">No workouts found.</div>}
      </div>
  );
};

export default Workouts;