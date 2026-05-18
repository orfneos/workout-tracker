import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { User } from '../types/User';

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

 
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

   if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-100">
            <LoadingSpinner size="lg" />
        </div>
    );
}
    if (!user) {
        navigate('/login');
        return null; // Prevent rendering while redirecting
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100 p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
                    Welcome {user.name}!
                </h1>

                <div className="flex flex-col gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => navigate('/workouts')}
                    >
                        Workout List
                    </Button>

                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                        onClick={() => navigate('/create-workout')}
                    >
                        Create New Workout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Profile;