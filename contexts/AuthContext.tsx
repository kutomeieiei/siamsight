
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, PersonalUser, BusinessUser } from '../types';

type SignupData = (Omit<PersonalUser, 'accountType'> & { password: string }) | (Omit<BusinessUser, 'accountType'> & { password: string });

interface AuthContextType {
  user: User | null;
  login: (identifier: string, pass: string) => Promise<void>;
  signup: (data: SignupData, accountType: 'personal' | 'business') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'siam-sight-v1-users';
const SESSION_KEY = 'siam-sight-v1-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize: Load session from "Server" (LocalStorage)
  useEffect(() => {
    try {
      const sessionUser = localStorage.getItem(SESSION_KEY);
      if (sessionUser) {
        const userData = JSON.parse(sessionUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Session recovery failed", e);
    }
  }, []);

  const login = async (identifier: string, pass: string): Promise<void> => {
    // Simulate server latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    const users = usersStr ? JSON.parse(usersStr) : {};
    
    const storedUser = users[identifier];
    
    if (storedUser && storedUser.password === pass) {
      const { password, ...userProfile } = storedUser;
      setUser(userProfile);
      setIsAuthenticated(true);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    } else {
      throw new Error('Incorrect name or password. Please try again.');
    }
  };
  
  const signup = async (data: SignupData, accountType: 'personal' | 'business'): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const usersStr = localStorage.getItem(USERS_STORAGE_KEY);
    const users = usersStr ? JSON.parse(usersStr) : {};
    
    const identifier = accountType === 'personal'
      ? (data as any).username
      : (data as any).businessName;

    if (users[identifier]) {
      throw new Error('This name is already registered in our system.');
    }
    
    const newUserProfile = { ...data, accountType };
    users[identifier] = newUserProfile;

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // Auto-login after signup
    const { password, ...userProfile } = newUserProfile;
    setUser(userProfile as User);
    setIsAuthenticated(true);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
  };
  
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
