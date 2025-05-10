import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
} from '../services/localStorage';
import { AuthContextType, User } from '../types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials for demo
const mockUsers = [
  { username: 'user', password: 'password' },
  { username: 'admin', password: 'admin' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Re-hydrate session on first load
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((r) => setTimeout(r, 800)); // fake latency

      const ok = mockUsers.find(
        (u) => u.username === username && u.password === password,
      );

      if (!ok) {
        setError('Invalid username or password');
        return false;
      }

      const authUser: User = { username, isAuthenticated: true };
      setUser(authUser);
      setStoredUser(authUser);
      return true;
    } catch {
      setError('Unexpected error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    removeStoredUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};