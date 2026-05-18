import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import  Input  from '../components/Input';
import Button from '../components/Button';
import  LoadingSpinner  from '../components/LoadingSpinner';
import { User } from '../types/User';

interface LoginProps {
  onLoginSuccess: () => void;
}

interface FormData {
  email: string;
  password: string;
}


interface AuthResponse {
  success: boolean;
  data?: {
    message: string;
    token: string;
    user: User;
  };
  error?: string;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear errors when the user starts typing
    if (error) setError('');
    if (name === 'email' && emailError) setEmailError('');
    if (name === 'password' && passwordError) setPasswordError('');
  };

  /**
   * Basic client-side validation with simple regex patterns
   * Note: Server should perform thorough validation
   */
  const validateForm = (): boolean => {
    let isValid = true;

    if (!formData.email.trim()) {
      setEmailError('Email is required. Please enter an email address.');
      isValid = false;
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setEmailError('Email is not valid.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!formData.password) {
      setPasswordError('Password is required. Please enter a password.');
      isValid = false;
    } else if (formData.password.length < 5) {
      setPasswordError('Password must be at least 5 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  /**
   * Handles authentication flow and localStorage persistence
   * Extracts username from email prefix for display purposes
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { email, password } = formData;
      const result: AuthResponse = isLogin
          ? await authAPI.login(email, password)
          : await authAPI.signup(email, password);


      if (result.success && result.data) {
        const userData = {
          _id: result.data.user._id,
          email: result.data.user.email,
          name: result.data.user.email.split('@')[0]
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', result.data.token);
        onLoginSuccess?.();
        navigate('/profile');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmailError('');
    setPasswordError('');
    setFormData({ email: '', password: '' });
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
              <svg
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Login to your account' : 'Create your account'}
            </h2>
            <p className="text-sm text-gray-600">
              Track your workouts and achieve your fitness goals
            </p>
          </div>

          {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full"
                />
                {emailError && (
                    <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full"
                />
                {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </div>

            {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        disabled={loading}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full"
              >
                {loading ? <LoadingSpinner size="sm" /> : (isLogin ? 'Login' : 'Sign up')}
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <Button
                type="button"
                variant="secondary"
                onClick={toggleMode}
                disabled={loading}
                className="text-indigo-600 bg-transparent hover:bg-transparent font-medium"
        
              >
                {isLogin ? 'Sign up' : 'Login'}
              </Button>
              </p>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;