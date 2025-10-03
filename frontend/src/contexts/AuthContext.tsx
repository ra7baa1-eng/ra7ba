'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenant?: {
    id: string;
    subdomain: string;
    name: string;
    status: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (!accessToken || !refreshToken || !storedUser) {
        setLoading(false);
        return;
      }

      // Try to parse stored user
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Validate token by making a test request
      try {
        const { data } = await authApi.validateToken();
        setUser(data.user);
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch (error: any) {
        // Token might be expired, try to refresh
        if (error.response?.status === 401) {
          try {
            const { data } = await authApi.refreshToken(refreshToken);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            
            // Get user info again
            const userResponse = await authApi.getProfile();
            setUser(userResponse.data);
            localStorage.setItem('user', JSON.stringify(userResponse.data));
          } catch (refreshError) {
            // Refresh failed, logout
            console.log('Refresh token failed, logging out');
            logout();
          }
        } else {
          // Use stored user data if validation fails for other reasons
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password);
      
      // Save tokens and user data
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);

      // Redirect based on role
      if (data.user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else if (data.user.role === 'MERCHANT') {
        router.push('/merchant/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    setUser(null);
    router.push('/auth/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
