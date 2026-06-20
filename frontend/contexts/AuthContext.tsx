// frontend/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log('API URL:', apiUrl);
      
      // Ensure URL doesn't have trailing slash
      const baseUrl = apiUrl?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/auth/login`;
      console.log('Login URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Login failed');
      }

      const data = await response.json();
      setToken(data.token);
      setUser({ 
        id: 0, 
        username: data.username, 
        email: data.email, 
        role: data.role 
      });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ 
        username: data.username, 
        email: data.email, 
        role: data.role 
      }));
      
      toast.success(`Welcome back, ${data.username}!`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const baseUrl = apiUrl?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/auth/register`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Registration failed');
      }

      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}