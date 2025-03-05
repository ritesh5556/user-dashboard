import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { withProtectedRoute } from '../components/ProtectedRoute';
import { UserForm } from '../components/UserForm';
import { User, UserInput } from '../types/user';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

function Dashboard() {
  const { user: currentUser, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersCollection = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollection);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Please check your database permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: UserInput) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = {
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const usersCollection = collection(db, 'users');
      await addDoc(usersCollection, newUser);
      setIsFormVisible(false);
      await loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user. Please check your database permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userData: UserInput) => {
    if (!editingUser) return;
    try {
      setLoading(true);
      setError(null);
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: Timestamp.now()
      });
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please check your database permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setLoading(true);
      setError(null);
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please check your database permissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">User Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-slate-600 text-sm sm:text-base font-medium">Welcome, {currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-medium shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-3xl font-bold text-slate-800">Manage Users</h2>
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2.5 rounded-full hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 w-full sm:w-auto font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
              disabled={loading}
            >
              <span>Add New User</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {(isFormVisible || editingUser) && (
            <div className="mb-8 bg-white shadow-lg rounded-2xl p-6 border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <UserForm
                onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                initialData={editingUser ? { name: editingUser.name, email: editingUser.email } : undefined}
                buttonText={editingUser ? 'Update User' : 'Create User'}
              />
              <button
                onClick={() => {
                  setIsFormVisible(false);
                  setEditingUser(null);
                }}
                className="mt-4 text-slate-500 hover:text-slate-700 font-medium transition-colors duration-200 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-2xl border border-slate-100">
              {users.map((user, index) => (
                <div key={user.id} className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 ${
                  index !== users.length - 1 ? 'border-b border-slate-100' : ''
                }`}>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">{user.name}</h4>
                    <p className="text-slate-500 mt-1">{user.email}</p>
                  </div>
                  <div className="flex space-x-4 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-rose-600 hover:text-rose-800 font-medium px-4 py-2 rounded-full hover:bg-rose-50 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && !loading && (
                <div className="p-8 text-center">
                  <p className="text-slate-500 text-lg">No users found.</p>
                  <p className="text-slate-400 mt-1">Click "Add New User" to create one.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withProtectedRoute(Dashboard);
