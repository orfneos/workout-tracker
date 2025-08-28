import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    _id: string;
    email: string;
    name: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    /**
     * Artificial delay for better UX - prevents flash of loading state
     * In production, consider removing or reducing the timeout
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
                <div className="text-xl">Loading profile...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
                <div className="text-xl">No user found</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100 p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
                    Welcome {user.name}!
                </h1>

                <div className="flex flex-col gap-4">
                    <button
                        className="px-6 py-3 text-lg border-none rounded-lg bg-blue-500 text-white cursor-pointer transition-colors duration-200 hover:bg-blue-600 w-full"
                        onClick={() => navigate('/workouts')}
                    >
                        Workout List
                    </button>
                    <button
                        className="px-6 py-3 text-lg border-none rounded-lg bg-green-500 text-white cursor-pointer transition-colors duration-200 hover:bg-green-600 w-full"
                        onClick={() => navigate('/create-workout')}
                    >
                        Create New Workout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;