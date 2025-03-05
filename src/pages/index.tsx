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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-xl font-semibold">User Dashboard</h1>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-gray-600 text-sm sm:text-base">Welcome, {currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>
            <button
              onClick={() => setIsFormVisible(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full sm:w-auto"
              disabled={loading}
            >
              Add New User
            </button>
          </div>

          {(isFormVisible || editingUser) && (
            <div className="mb-8 bg-white shadow rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">
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
                className="mt-4 text-gray-600 hover:text-gray-900 w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex space-x-4 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 px-3 py-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && !loading && (
                <div className="p-6 text-center text-gray-500">
                  No users found. Click "Add New User" to create one.
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
