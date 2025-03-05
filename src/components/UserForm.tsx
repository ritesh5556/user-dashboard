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
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-shadow duration-200"
            placeholder="Enter user's name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="block w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 transition-shadow duration-200"
            placeholder="Enter user's email"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto min-w-[200px] flex justify-center items-center rounded-full border border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-base font-medium text-white shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        {buttonText}
      </button>
    </form>
  );
};
