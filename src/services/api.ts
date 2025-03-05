import axios from 'axios';
import { User, UserInput } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<User> => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: UserInput): Promise<User> => {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: UserInput): Promise<User> => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
  }
};
