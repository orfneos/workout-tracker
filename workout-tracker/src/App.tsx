import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Header from './pages/Header';
import { authAPI } from './api';
import CreateWorkout from './pages/CreateWorkout';
import Workouts from './pages/Workouts';
import Footer from './components/Footer';

interface AppRoutesProps {
    isLoggedIn: boolean;
    onLoginSuccess: () => void;
    onLogout: () => void;
}

/**
 * Route configuration with authentication guards
 * Protected routes automatically redirect to login if user is not authenticated
 */
function AppRoutes({ isLoggedIn, onLoginSuccess, onLogout }: AppRoutesProps) {
    const navigate = useNavigate();

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? <Navigate to="/profile" replace /> : <Login onLoginSuccess={onLoginSuccess} />
                    }
                />
                <Route
                    path="/profile"
                    element={
                        isLoggedIn ? (
                            <>
                                <Header onLogout={onLogout} />
                                <Profile />
                            </>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/create-workout"
                    element={
                        isLoggedIn ? (
                            <>
                                <Header onLogout={onLogout} />
                                <CreateWorkout onSave={() => navigate('/profile')} onCancel={() => navigate('/profile')} />
                            </>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route
                    path="/workouts"
                    element={
                        isLoggedIn ? (
                            <>
                                <Header onLogout={onLogout} />
                                <Workouts />
                            </>
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Footer />
        </>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        if (authAPI.isAuthenticated()) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = (): void => {
        authAPI.logout();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const handleLoginSuccess = (): void => {
        if (authAPI.isAuthenticated()) {
            setIsLoggedIn(true);
        }
    };

    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <AppRoutes isLoggedIn={isLoggedIn} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
            </div>
        </Router>
    );
}

export default App;