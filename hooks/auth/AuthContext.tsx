import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { router } from 'expo-router';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  memberSince: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.log('🔐 Auth token found in storage:', !!token);
      console.log('🔐 Token value:', token ? `${token.substring(0, 20)}...` : 'none');
      
      if (token) {
        console.log('🔐 Verifying token with backend...');
        const userData = await apiService.getProfile();
        setUser(userData);
        console.log('✅ User authenticated:', userData.name);
      } else {
        console.log('🔐 No auth token found');
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      await AsyncStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login process for:', email);
    setLoading(true);
    try {
      const response = await apiService.login({ email, password });
      console.log('🔐 Login response received, token:', response.token ? `${response.token.substring(0, 20)}...` : 'none');
      
      // Store token
      await AsyncStorage.setItem('authToken', response.token);
      
      // Verify token was stored
      const storedToken = await AsyncStorage.getItem('authToken');
      console.log('🔐 Token stored successfully:', !!storedToken);
      console.log('🔐 Stored token:', storedToken ? `${storedToken.substring(0, 20)}...` : 'none');
      
      setUser(response.user);
      console.log('✅ Login successful, user set:', response.user.name);
      
      // Navigate after state is updated
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    console.log('🔐 Starting registration process for:', userData.email);
    setLoading(true);
    try {
      const response = await apiService.register(userData);
      console.log('🔐 Registration response received, token:', response.token ? `${response.token.substring(0, 20)}...` : 'none');
      
      if (!response.token) {
        throw new Error('No token received from server');
      }
      
      // Store token
      await AsyncStorage.setItem('authToken', response.token);
      
      // Verify token was stored
      const storedToken = await AsyncStorage.getItem('authToken');
      console.log('🔐 Token stored successfully:', !!storedToken);
      console.log('🔐 Stored token value:', storedToken ? `${storedToken.substring(0, 20)}...` : 'none');
      
      setUser(response.user);
      console.log('✅ Registration successful, user set:', response.user.name);
      
      // Navigate after state is updated
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('authToken');
      setUser(null);
      console.log('✅ Logout successful');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      initialized 
    }}>
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