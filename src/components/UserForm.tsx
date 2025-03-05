import React, { useState } from 'react';
import { UserInput } from '../types/user';

interface UserFormProps {
  onSubmit: (data: UserInput) => void;
  initialData?: UserInput;
  buttonText?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  initialData = { name: '', email: '' },
  buttonText = 'Submit'
}) => {
  const [formData, setFormData] = useState<UserInput>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm"
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-sm"
            placeholder="Enter email"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 sm:py-2 text-base sm:text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
};
