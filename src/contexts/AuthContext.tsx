import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string; 
  full_name: string; 
  phone: string; 
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log(email,password);
      
      const response = await axios.post('https://property-mngnt-backend-seven.vercel.app/login', { 
        email, 
        password 
      });
      console.log(response);
      
      const { token, user } = response.data; // Assuming backend sends { token, user }

      // Store user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
    } catch (error) {
      console.error('authContext Login failed:', error);
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


export { AuthProvider, useAuth };