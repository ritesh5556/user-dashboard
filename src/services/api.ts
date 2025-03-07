import axios from 'axios';

const API_BASE = 'https://us-central1-nextjs-c0475.cloudfunctions.net';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      const response = await axios.get(`${API_BASE}/getUsers`);
      return response.data;
    },

    getById: async (id: string): Promise<User> => {
      const response = await axios.get(`${API_BASE}/getUserById/${id}`);
      return response.data;
    },

    create: async (userData: { name: string; email: string }): Promise<User> => {
      const response = await axios.post(`${API_BASE}/createUser`, userData);
      return response.data;
    },

    update: async (id: string, userData: { name: string; email: string }): Promise<User> => {
      const response = await axios.put(`${API_BASE}/updateUser/${id}`, userData);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await axios.delete(`${API_BASE}/deleteUser/${id}`);
    },
  },
};
