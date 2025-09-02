import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Configurações do servidor
  const SERVER_URL = 'http://206.0.29.38';
  const API_URL = `${SERVER_URL}/api`;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      
      // Simular chamada de API (substituir pela API real)
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Salvar dados no AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro no login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Fallback para desenvolvimento (simular login)
      if (username === 'test' && password === 'test') {
        const mockUser = {
          id: 1,
          username: 'test',
          email: 'test@proedition.com',
          vipLevel: 1,
          characters: [
            { id: 1, name: 'DarkKnight', level: 400, class: 'Dark Knight' },
            { id: 2, name: 'DarkWizard', level: 380, class: 'Dark Wizard' },
          ],
          lastLogin: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem('authToken', 'mock-token-123');
        await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        return { success: false, error: 'Senhas não coincidem' };
      }

      setIsLoading(true);
      
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: 'Conta criada com sucesso!' };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro no registro' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro de conexão' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const updateUser = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        const response = await fetch(`${API_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
    SERVER_URL,
    API_URL,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
