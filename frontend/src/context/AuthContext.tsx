import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRead, UserCreate } from '../api/auth'; // We'll create this auth.ts next
import { loginUser, registerUser, fetchCurrentUser } from '../api/auth'; // Functions to interact with backend

interface AuthContextType {
  user: UserRead | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
  hasRole: (role: 'admin' | 'moderator' | 'student') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const currentUser = await fetchCurrentUser(storedToken);
          setUser(currentUser);
          // console.log("User loaded from storage:", currentUser);
        } catch (error) {
          console.error("Failed to fetch current user with stored token:", error);
          localStorage.removeItem('token'); // Invalid token, clear it
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    loadUserFromStorage();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const response = await loginUser(username, password);
    localStorage.setItem('token', response.access_token);
    setToken(response.access_token);
    const currentUser = await fetchCurrentUser(response.access_token);
    setUser(currentUser);
  };

  const handleRegister = async (userData: UserCreate) => {
    const newUser = await registerUser(userData);
    // Optionally log in the user immediately after registration
    // For now, just register and let them log in manually
    // await handleLogin(userData.username, userData.password); 
    return newUser;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const hasRole = (role: 'admin' | 'moderator' | 'student') => {
    if (!user) return false;
    if (role === 'admin') return user.role === 'admin';
    if (role === 'moderator') return user.role === 'admin' || user.role === 'moderator';
    if (role === 'student') return user.role === 'admin' || user.role === 'moderator' || user.role === 'student';
    return false;
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login: handleLogin, register: handleRegister, logout: handleLogout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
