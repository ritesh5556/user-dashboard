'use client';

import { useState, useEffect } from 'react';
import { User, api } from '../services/api';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.users.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.users.create(formData);
      setFormData({ name: '', email: '' });
      loadUsers();
    } catch (err) {
      setError('Failed to create user');
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      await api.users.update(editingUser.id, formData);
      setEditingUser(null);
      setFormData({ name: '', email: '' });
      loadUsers();
    } catch (err) {
      setError('Failed to update user');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.users.delete(id);
      loadUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={editingUser ? handleUpdate : handleCreate} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {editingUser ? 'Update User' : 'Create User'}
        </button>
        {editingUser && (
          <button
            type="button"
            onClick={() => {
              setEditingUser(null);
              setFormData({ name: '', email: '' });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div>
              <button
                onClick={() => startEdit(user)}
                className="text-blue-500 hover:text-blue-600 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
