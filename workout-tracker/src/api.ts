import axios, { AxiosResponse, AxiosError } from 'axios';
import { Workout, CreateWorkout } from './types/Workouts';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

/**
 * Automatically adds JWT token to all requests if available
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AuthResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  status?: number;
}

interface WorkoutResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  status?: number;
}

/**
 * Centralized API client for authentication and workout operations
 * All methods return standardized response objects with success/error handling
 */
export const authAPI = {

  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse = await api.post('/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return {
        success: true,
        data: response.data,
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Login error:', error);
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || 'Failed to login. Please try again.',
        status: axiosError.response?.status
      };
    }
  },

  signup: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response: AxiosResponse = await api.post('/signup', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return {
        success: true,
        data: response.data,
        message: 'Account created successfully!'
      };
    } catch (error) {
      console.error('Signup error:', error);
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || 'Failed to create account. Please try again.',
        status: axiosError.response?.status
      };
    }
  },

  logout: (): AuthResponse => {
    localStorage.removeItem('token');
    return {
      success: true,
      message: 'Logged out successfully!'
    };
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  saveWorkout: async (workout: CreateWorkout): Promise<WorkoutResponse> => {
    try {
      const response: AxiosResponse = await api.post('/workout/save', workout);
      return {
        success: true,
        data: response.data,
        message: 'Workout saved!'
      };
    } catch (error) {
      console.error('Save workout error:', error);
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || 'Failed to save workout.',
        status: axiosError.response?.status
      };
    }
  },

  getWorkouts: async (): Promise<WorkoutResponse> => {
    try {
      const response: AxiosResponse = await api.get('/workouts');
      return {
        success: true,
        data: response.data.workouts,
      };
    } catch (error) {
      console.error('Get workouts error:', error);
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || 'Failed to fetch workouts.',
        status: axiosError.response?.status
      };
    }
  },

  updateWorkout: async (id: string, workout: Workout): Promise<WorkoutResponse> => {
    try {
      const response: AxiosResponse = await api.put(`/workout/${id}`, workout);
      return {
        success: true,
        data: response.data.workout,
        message: 'Workout updated!'
      };
    } catch (error) {
      console.error('Update workout error:', error);
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || 'Failed to update workout.',
        status: axiosError.response?.status
      };
    }
  },

  deleteWorkout: async (id: string): Promise<WorkoutResponse> => {
    try {
      await api.delete(`/workout/${id}`);
      return { success: true, message: 'Workout deleted!' };
    } catch (error) {
      console.error('Delete workout error:', error);
      const axiosError = error as AxiosError;
      return {
        success: false,
        error: (axiosError.response?.data as any)?.message || 'Failed to delete workout.',
        status: axiosError.response?.status
      };
    }
  },
};

export default api;