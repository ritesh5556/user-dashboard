import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(router.pathname);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      // Redirect to login if no user and not on a public path
      if (!user && !isPublicPath) {
        router.push('/login');
      }
    });

    return unsubscribe;
  }, [router.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      setError('Failed to sign in. Please check your credentials.');
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      setError('Failed to create account. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      setError('Failed to log out. Please try again.');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    logout
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
